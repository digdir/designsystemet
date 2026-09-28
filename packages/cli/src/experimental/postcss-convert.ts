/**
 * README:
 * Run this file from root by using the command:
 * node packages/cli/src/experimental/postcss-convert.ts
 */

// NOTE:
// - Collects variables from top level or @layer defined :root, [data-color="SCALE"] and [data-size="SCALE"] selectors
// - Will skip composed selectors like [data-color].red, or :is(:root), :not([data-color="blue"]) etc.
// - Augments [data-color="SCALE"] with missing --ds-color-*--(light|dark) definitions
// - Replaces color(from ) with hex codes for backwards compatibility
// - Outputs JSON file with computed values (length to integers) etc. for design token creation

import fs from 'node:fs';
import path from 'node:path';
import { convert, resolve, utils } from '@asamuzakjp/css-color';
import postcss, { type Declaration, type PluginCreator, type Root, type Rule } from 'postcss';
import valueParser from 'postcss-value-parser';

const REM = 16; // 1rem = 16px when computing the JSON
const DS_PREFIX = '--ds-';
const DS_SIZE_PREFIX = '--ds-size';
const DS_COLOR_PREFIX = '--ds-color';
const COLOR_FUNCTIONS = new Set(['color', 'rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch']);

const REGEX_ROOT = /(^|,)\s*:root\s*(,|$)/; // :root as a whole selector in the list, not :root .child or :not(:root)
const REGEX_COLOR_SCALE = /(^|,)\s*\[data-color=['"]([^'"\]]+)['"]\]\s*(,|$)/;
const REGEX_SIZE_SCALE = /(^|,)\s*\[data-size=['"]([^'"\]]+)['"]\]\s*(,|$)/;
const REGEX_CSS_VAR_SIZE_STEP = /^--ds-size-(\d+)$/; // --ds-size-<step>, the numeric size tokens
const REGEX_CSS_VAR_SCHEME = /^--ds-color-(.+--(light|dark))$/;
const REGEX_MATH =
  /^(calc|min|max|clamp|round|mod|rem|abs|sign|pow|sqrt|hypot|log|exp|sin|cos|tan|asin|acos|atan|atan2)\(|^-?[\d.]+(rem|px|em)?$/i;

type Color = { prop: string; token: string; scheme: 'light' | 'dark'; value: string };

/** JSON of computed tokens: `color.<scale>.<token>` and `size.<scale>.<step>` for scales, `<group>.<token>` for the rest */
export type Tokens = Record<string, Record<string, string | number>> & {
  color: Record<string, Record<string, string>>;
  size: Record<string, Record<string, number>>;
};

export type TokensMessage = {
  plugin: 'postcss-convert';
  type: 'tokens';
  json: Tokens;
};

const postcssConvert: PluginCreator<undefined> = () => ({
  postcssPlugin: 'postcss-convert',

  Once(root, { result }) {
    const sources = [...readImports(root), root]; // Read local @import-ed files
    const tokens: Tokens = { color: {}, size: {} };
    const colors: Color[] = [];
    const globalCssVars = new Map(); // Custom properties on :root

    // 1. Collect global CSS custom properties
    walkSources(sources, globalCssVars, REGEX_ROOT, ({ cssVars }) => {
      for (const [prop, value] of cssVars) globalCssVars.set(prop, value);
    });

    // 2. Collect color variables based global --ds-color-*--light and --ds-color-*--dark
    for (const [prop, value] of globalCssVars) {
      const [, token, scheme] = prop.match(REGEX_CSS_VAR_SCHEME) || [];
      if (scheme) colors.push({ prop, token, scheme, value } as Color);
    }

    // 3. Augment [data-color="SCALE"] with all color variables and collect tokens
    walkSources(sources, globalCssVars, REGEX_COLOR_SCALE, ({ rule, cssVars, match: [, , scaleName] }) => {
      tokens.color[scaleName] ||= {}; // Register scale
      colors.forEach(({ prop, token, value: color }) => {
        const decl = rule.nodes.find((n): n is Declaration => n.type === 'decl' && n.prop === prop);
        const value = toHex(decl?.value ?? color, cssVars);
        decl?.remove(); // Avoid duplicate declaration
        rule.append({ prop, value, raws: { before: rule.last?.raws.before ?? '\n  ' } });
        tokens.color[scaleName][token] = value; // Keyed like the CSS property: text-default--light
      });
    });

    // 4. Generate JSON tokens for size scales
    walkSources(sources, globalCssVars, REGEX_SIZE_SCALE, ({ cssVars, match: [, , scaleName] }) => {
      tokens.size[scaleName] ||= {}; // Register scale
      for (const [prop, value] of cssVars) {
        const step = prop.match(REGEX_CSS_VAR_SIZE_STEP)?.[1];
        if (!step) continue;
        const computed = computeValue(value, cssVars);
        if (typeof computed !== 'number') throw new Error(`Could not compute ${prop}: ${value} (${computed})`);
        tokens.size[scaleName][step] = computed;
      }
    });

    // 5. Remaining global --ds-* tokens, grouped by name: --ds-border-radius-sm -> border-radius.sm
    for (const [prop, value] of globalCssVars) {
      if (!prop.startsWith(DS_PREFIX) || prop.startsWith(DS_COLOR_PREFIX) || prop.startsWith(DS_SIZE_PREFIX)) continue;
      const segments = prop.slice(DS_PREFIX.length).split('-');
      const key = segments.pop() ?? '';
      const group = segments.join('-') || key;
      tokens[group] ??= {};
      tokens[group][key] = computeValue(value, globalCssVars);
    }

    result.messages.push({
      type: 'tokens',
      plugin: 'postcss-convert',
      json: tokens,
    });
  },
});

/**
 * Parse the local files a root `@import`s, recursively and in order, without touching the root.
 * Paths are resolved relative to the importing file (`from` in the postcss options), or the working
 * directory. `layer(name)` wraps the content in `@layer name`. Imports with a remote url, or with
 * media, supports or other conditions, are skipped.
 */
const readImports = (root: Root, seen: string[] = []): Root[] => {
  const file = root.source?.input.file;
  const roots: Root[] = [];
  root.walkAtRules('import', (atRule) => {
    const { url, layer, conditional } = parseImport(atRule.params);
    if (!url || conditional || url.includes('://')) return;

    const target = path.resolve(file ? path.dirname(file) : process.cwd(), url);
    if (seen.includes(target)) throw new Error(`Circular @import: ${[...seen, target].join(' -> ')}`);
    const imported = postcss.parse(fs.readFileSync(target, 'utf-8'), { from: target });
    roots.push(...readImports(imported, [...seen, target]));
    if (layer !== undefined) {
      const wrapper = postcss.atRule({ name: 'layer', params: layer });
      wrapper.append(...imported.nodes); // append() moves the nodes out of imported
      imported.append(wrapper);
    }
    roots.push(imported);
  });
  return roots;
};

/** Split `@import` params into the url, the layer name ('' for an anonymous `layer`) and whether other conditions follow */
const parseImport = (params: string) => {
  const result: { url?: string; layer?: string; conditional: boolean } = { conditional: false };
  for (const node of valueParser(params).nodes) {
    if (node.type === 'space' || node.type === 'comment') continue;
    const name = node.value.toLowerCase();
    if (!result.url && node.type === 'string') result.url = node.value;
    else if (!result.url && node.type === 'function' && name === 'url') result.url = node.nodes[0]?.value;
    else if (node.type === 'function' && name === 'layer') result.layer = valueParser.stringify(node.nodes).trim();
    else if (node.type === 'word' && name === 'layer') result.layer = '';
    else result.conditional = true;
  }
  return result;
};

const walkSources = (
  sources: Root[],
  globalCssVars: Map<string, string>,
  selectorFilter: RegExp,
  eachRule: (found: { rule: Rule; cssVars: Map<string, string>; match: RegExpMatchArray }) => void,
) => {
  for (const source of sources)
    source.walkRules(selectorFilter, (rule) => {
      if (!isTopLevel(rule)) return; // Only generate tokens from top level definitions
      const cssVars = new Map(globalCssVars); // Collect all CSS custom properties in current scope
      const match = rule.selector.toString().match(selectorFilter) as RegExpMatchArray;

      rule.walkDecls(/^--/, ({ prop, value }) => {
        cssVars.set(prop, value);
      });
      eachRule({ rule, cssVars, match });
    });
};

/** True when the rule is at the root, or directly inside a top-level `@layer` (nested layers do not count) */
const isTopLevel = ({ parent: p }: Rule) =>
  p?.type === 'root' || (p?.type === 'atrule' && p?.name === 'layer' && p?.parent?.type === 'root');

/** Compute a color value to #rrggbb (#rrggbbaa when translucent) */
const toHex = (value: string, props: Map<string, string>): string => {
  const ast = valueParser(resolveVars(value, props));
  evaluateRelativeColors(ast.nodes);
  const css = ast.toString().trim();
  const hex = convert.colorToHex(css, { alpha: true });
  if (!hex) throw new Error(`Could not compute color: ${value} (${css})`);
  return hex;
};

/** Compute a token value for the JSON: px integers for lengths, hex for colors, otherwise the resolved string */
const computeValue = (value: string, props: Map<string, string>): string | number => {
  const resolved = resolveVars(value, props);
  if (utils.isColor(resolved)) return toHex(resolved, props);

  const computed = REGEX_MATH.test(resolved)
    ? utils.cssCalc(`calc(${resolved})`, { dimension: { rem: REM, em: REM } })
    : resolved;
  const number = computed.match(/^(-?[\d.]+)(px)?$/);
  return number ? Math.round(Number(number[1])) : computed;
};

/** Substitute var() references, recursively. Undeclared properties use their fallback, or throw */
const resolveVars = (value: string, props: Map<string, string>, stack: string[] = []): string => {
  const ast = valueParser(value);
  ast.walk((node) => {
    if (node.type !== 'function' || node.value.toLowerCase() !== 'var') return;
    const [name, ...rest] = node.nodes.filter((child) => child.type !== 'space');
    const prop = name?.value;
    const fallback = rest.length > 1 ? valueParser.stringify(rest.slice(1)).trim() : undefined;
    if (!prop) throw new Error(`Invalid var(): ${valueParser.stringify(node)}`);
    if (stack.includes(prop)) throw new Error(`Circular custom property: ${[...stack, prop].join(' -> ')}`);
    const declared = props.get(prop) ?? fallback;
    if (declared === undefined) throw new Error(`Unknown custom property: ${prop}`);

    const value = resolveVars(declared, props, [...stack, prop]);
    Object.assign(node, { type: 'word', value, nodes: [] });
    return false;
  });
  return ast.toString().trim();
};

/**
 * @asamuzakjp/css-color does not support nested relative colors such as
 * color(from color(from red srgb-linear r g b / 0.5) srgb-linear r g b),
 * so evaluate the innermost relative color functions first.
 */
const evaluateRelativeColors = (nodes: valueParser.Node[]) => {
  for (const node of nodes) {
    if (node.type !== 'function') continue;
    evaluateRelativeColors(node.nodes);

    const isRelative = node.nodes.some(({ type, value }) => type === 'word' && value.toLowerCase() === 'from');
    if (!COLOR_FUNCTIONS.has(node.value.toLowerCase()) || !isRelative) continue;

    // resolve() silently returns transparent for invalid input, so validate with colorToHex first
    const css = valueParser.stringify(node);
    const value = convert.colorToHex(css, { alpha: true }) && resolve(css, { format: 'computedValue' });
    if (!value) throw new Error(`Invalid color: ${css}`);
    Object.assign(node, { type: 'word', value, nodes: [] });
  }
};

postcssConvert.postcss = true;

export default postcssConvert;

// Run directly: convert before.css to after.css and after.json
if (process.argv[1] === import.meta.filename) {
  const dir = import.meta.dirname;
  const from = path.join(dir, 'before.css');
  const result = await postcss([postcssConvert()]).process(fs.readFileSync(from, 'utf-8'), { from });
  const json = result.messages.find((message): message is TokensMessage => message.type === 'tokens')?.json;
  // console.log({
  //   json: JSON.stringify(json, null, 2),
  //   css: result.css.slice(-2000),
  // });
  fs.writeFileSync(path.join(dir, 'after.css'), result.css);
  fs.writeFileSync(path.join(dir, 'after.json'), `${JSON.stringify(json, null, 2)}\n`);
  console.log('Wrote after.css and after.json');
}
