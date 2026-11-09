// biome-ignore-all lint/suspicious/noExplicitAny: the config is read before it is validated, so it can have any shape
import { applyEdits, findNodeAtLocation, modify, parseTree } from 'jsonc-parser';
import pc from 'picocolors';
import { convertToHex, generateColorScale } from '../colors/index.ts';
import { semanticColorNames } from '../colors/specs.ts';
import type { SemanticColorNames } from '../colors/types.ts';
import { severityColors } from '../schemas/defaults.ts';
import { parseJsonc } from '../schemas/helpers.ts';
import { stringifyConfig } from '../utils/stringify-config.ts';

const formattingOptions = { insertSpaces: true, tabSize: 2 } as const;

type StepColors = { light?: string; dark?: string };
type ColorSteps = Partial<Record<SemanticColorNames, StepColors>>;
type Color = string | ColorSteps;

type Automigrate = {
  name: string;
  check: (config: string) => boolean;
  message: string;
  yes: (config: string, context?: { configFilePath?: string }) => string;
  no: (config: string) => string;
};

const isObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSameColor = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

const hasDeprecatedOverrides = (theme: unknown): boolean =>
  isObject(theme) &&
  isObject(theme.overrides) &&
  (theme.overrides.colors !== undefined || theme.overrides.severity !== undefined);

const hasDeprecatedOverridesInConfig = (config: string): boolean => {
  const { themes } = parseJsonc<any>(config);
  return isObject(themes) && Object.values(themes).some(hasDeprecatedOverrides);
};

/** The steps in the order of the color scale, leaving out empty ones. */
const inScaleOrder = (steps: ColorSteps): ColorSteps =>
  Object.fromEntries(
    semanticColorNames.flatMap((step) =>
      steps[step] && Object.keys(steps[step]).length > 0 ? [[step, steps[step]]] : [],
    ),
  );

/**
 * A color with the step overrides of `overrides.colors` set on it, which gives the same colors.
 *
 * The base color the scale is generated from is the color's `base-default` in light. An override of that step only
 * changed the step, not the rest of the scale, so then every step is written, generated from the original base color.
 */
export const withStepOverrides = (color: Color, overrides: ColorSteps): ColorSteps => {
  const base = typeof color === 'string' ? color : color['base-default']?.light;
  if (!base) {
    throw new Error('The color has no base color');
  }
  const steps: ColorSteps = typeof color === 'string' ? {} : color;
  const merged = (step: SemanticColorNames, generated?: StepColors): StepColors => ({
    ...generated,
    ...steps[step],
    ...overrides[step],
  });

  const overriddenBase = overrides['base-default']?.light;
  if (overriddenBase && !isSameColor(overriddenBase, base)) {
    const light = generateColorScale(convertToHex(base), 'light');
    const dark = generateColorScale(convertToHex(base), 'dark');
    return Object.fromEntries(
      semanticColorNames.map((step) => [step, merged(step, { light: light[step].hex, dark: dark[step].hex })]),
    );
  }

  const result: ColorSteps = {};
  for (const step of semanticColorNames) {
    result[step] = merged(step);
  }
  result['base-default'] = { ...result['base-default'], light: base };
  return inScaleOrder(result);
};

/**
 * The colors of a theme with its `overrides.severity` and `overrides.colors` set on them, in the same order the CLI
 * applies them: `overrides.severity` replaces the whole color, then `overrides.colors` sets steps on it.
 * Overrides of colors the theme doesn't have had no effect, and are left out.
 */
export const migrateThemeColors = (theme: any): { colors: Map<string, Color>; ignored: string[] } => {
  const colors = new Map<string, Color>();
  const ignored: string[] = [];
  const themeColors: Record<string, Color> = isObject(theme.colors) ? theme.colors : {};
  const current = (name: string): Color | undefined =>
    colors.get(name) ??
    (Object.hasOwn(themeColors, name)
      ? themeColors[name]
      : Object.hasOwn(severityColors, name)
        ? severityColors[name as keyof typeof severityColors]
        : undefined);

  for (const [name, hex] of Object.entries(theme.overrides?.severity ?? {})) {
    colors.set(name, hex as string);
  }
  for (const [name, overrides] of Object.entries(theme.overrides?.colors ?? {})) {
    const color = current(name);
    if (color === undefined) {
      ignored.push(name);
      continue;
    }
    colors.set(name, withStepOverrides(color, overrides as ColorSteps));
  }
  return { colors, ignored };
};

/** Sets a value, formatted like the theme builder writes a config, indented to where it is. */
const setValue = (text: string, path: string[], value: unknown): string => {
  let result = applyEdits(text, modify(text, path, value, { formattingOptions }));
  const tree = parseTree(result);
  const node = tree && findNodeAtLocation(tree, path);
  if (!node?.parent) {
    return result;
  }
  const lineStart = result.lastIndexOf('\n', node.parent.offset - 1) + 1;
  const indent = /^[ \t]*/.exec(result.slice(lineStart))?.[0] ?? '';
  const formatted = stringifyConfig(value).replaceAll('\n', `\n${indent}`);
  result = result.slice(0, node.offset) + formatted + result.slice(node.offset + node.length);
  return result;
};

const removeValue = (text: string, path: string[]): string =>
  applyEdits(text, modify(text, path, undefined, { formattingOptions }));

export const migrateOverridesToColorSteps = (config: string): string => {
  const { themes } = parseJsonc<any>(config);
  if (!isObject(themes)) {
    return config;
  }

  let configText = config;
  for (const [themeName, theme] of Object.entries(themes)) {
    if (!hasDeprecatedOverrides(theme)) {
      continue;
    }
    let colors: Map<string, Color>;
    try {
      const migrated = migrateThemeColors(theme);
      colors = migrated.colors;
      for (const name of migrated.ignored) {
        console.log(
          pc.yellow(
            `Theme "${themeName}": "overrides.colors.${name}" is removed, as the theme has no color "${name}" and it had no effect.`,
          ),
        );
      }
    } catch {
      console.log(pc.yellow(`Theme "${themeName}" has colors that aren't valid, so its overrides weren't migrated.`));
      continue;
    }

    for (const [name, color] of colors) {
      configText = setValue(configText, ['themes', themeName, 'colors', name], color);
    }
    configText = removeValue(configText, ['themes', themeName, 'overrides', 'colors']);
    configText = removeValue(configText, ['themes', themeName, 'overrides', 'severity']);
    if (Object.keys(parseJsonc<any>(configText).themes[themeName].overrides).length === 0) {
      configText = removeValue(configText, ['themes', themeName, 'overrides']);
    }
  }

  return configText;
};

const migration: Automigrate = {
  name: 'Color overrides to color steps',
  check: hasDeprecatedOverridesInConfig,
  message: `Your config file uses the deprecated ${pc.yellow('overrides.colors')} and/or ${pc.yellow('overrides.severity')} fields. \nThis migration will move them to the colors in ${pc.blue('colors')}: severity colors as hex colors, and overridden steps as color steps, e.g. ${pc.blue('"accent": { "base-default": { "light": "#0062ba" }, "border-default": { "dark": "#4c91cf" } }')}. The colors stay the same.\n`,
  yes: (config: string): string => {
    const migratedConfig = migrateOverridesToColorSteps(config);
    console.log(pc.green(`\nConfig file successfully migrated.`));
    return migratedConfig;
  },
  no: (config: string): string => {
    // The deprecated fields still work, so the config is used as it is.
    console.log(pc.yellow('\nMigration was skipped.\n'));
    return config;
  },
};

export default migration;
