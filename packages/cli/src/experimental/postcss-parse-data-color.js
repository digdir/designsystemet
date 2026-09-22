import fs from 'node:fs';
import { convert } from '@asamuzakjp/css-color';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';

const rawColors = {};
const dataColors = {};

const parseDataColors = () => ({
  postcssPlugin: 'parse-data-colors',

  // Collect all raw token values first.
  Rule(rule) {
    const colorScales = [];

    selectorParser((selectors) => {
      selectors.walkAttributes(({ attribute, value }) => {
        if (attribute === 'data-color' && value) colorScales.push(value);
      });
    }).processSync(rule.selector);

    if (colorScales.length === 0) return;

    rule.walkDecls(/^--ds-color-/, (decl) => {
      const tokenName = decl.prop.replace(/^--ds-color-/, '');
      for (const colorName of colorScales) {
        rawColors[colorName] ??= {};
        rawColors[colorName][tokenName] = parseLightDark(decl.value);
      }
    });
  },

  // Resolve variables + color-mix() for each mode.
  OnceExit() {
    // Resolve variables + color-mix() for each mode.
    for (const [colorName, tokens] of Object.entries(rawColors)) {
      dataColors[colorName] = {};
      for (const tokenName of Object.keys(tokens)) {
        dataColors[colorName][tokenName] = {
          light: resolveToken(colorName, tokenName, 'light'),
          dark: resolveToken(colorName, tokenName, 'dark'),
        };
      }
    }
  },
});

function resolveToken(colorName, tokenName, mode, stack = []) {
  const key = `${colorName}:${tokenName}:${mode}`;

  if (stack.includes(key))
    throw new Error(
      `Circular color reference: ${[...stack, key].join(' -> ')}`,
    );

  const token = rawColors[colorName]?.[tokenName];
  if (!token) throw new Error(`Unknown color token: --ds-color-${tokenName}`);

  // Resolve var(--ds-color-*) references recursively.
  const value = token[mode].replace(
    /var\(\s*--ds-color-([\w-]+)\s*\)/g,
    (_, reference) => resolveToken(colorName, reference, mode, [...stack, key]),
  );

  return convert.colorToHex(value, { alpha: true });
}

function parseLightDark(value) {
  const lightDark = valueParser(value).nodes.find(
    (node) =>
      node.type === 'function' && node.value.toLowerCase() === 'light-dark',
  );
  const split = lightDark?.nodes.findIndex(
    (node) => node.type === 'div' && node.value === ',',
  );

  if (!lightDark) return { light: value.trim(), dark: value.trim() };

  return {
    light: valueParser
      .stringify(split < 0 ? lightDark.nodes : lightDark.nodes.slice(0, split))
      .trim(),
    dark: valueParser.stringify(lightDark.nodes.slice(split + 1)).trim(),
  };
}

parseDataColors.postcss = true;

export default parseDataColors;

postcss([parseDataColors()])
  .process(fs.readFileSync('./postcss-parse-data-color.css', 'utf-8'), {
    from: undefined,
  })
  .then(() => console.log(dataColors));
