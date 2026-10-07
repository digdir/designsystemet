import {
  type ColorScheme,
  type CssColor,
  configColorsFromValues,
  defaultBorderRadius,
  defaultFontFamily,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
  FIGMA_COLLECTION,
  type SchemeColors,
  type SemanticColorNames,
  semanticColorSpec,
  type ThemeColorValues,
  validateConfig,
} from '@digdir/designsystemet/internal';
import pkg from '@digdir/designsystemet/package.json';
import type { CollectionData, VariableData } from './types';

// Rebuilds a config from the variables an import created. Each theme is a mode in the Theme collection,
// and its colors are in the Color scheme collection as `<theme>/<color>/<1-16>`. The config holds only
// each color's base color (`base-default` in Light, which is the input color unchanged); every other step
// is generated from it. Steps that differ from the generated scale, e.g. ones edited by hand in Figma,
// become `overrides`. Values that match the defaults are left out, like the theme builder does.
// The colors are worked out by the CLI's `configColorsFromValues`, which reading theme CSS uses too.

type ThemeConfig = NonNullable<ExternalConfigSchemaInput['themes']>[string];

export type ExportedConfig = {
  config: ExternalConfigSchemaInput & { $schema: string };
  /** What is in the file but can't be described by the config, and so is left out of it. */
  warnings: string[];
};

const SCHEMES: ColorScheme[] = ['light', 'dark'];
// Variables are named by step number today (`<theme>/<color>/12`). Step names (`<theme>/<color>/base-default`)
// are planned, so both are read, and the export itself works with step names.
const STEP_NAME_BY_NUMBER = new Map(
  Object.values(semanticColorSpec).map((step) => [
    String(step.number),
    step.name,
  ]),
);
const KNOWN_COLLECTIONS = new Set<string>(Object.values(FIGMA_COLLECTION));
// The colors in each theme's part of the Color scheme collection that aren't steps.
const OTHER_COLORS: Record<string, keyof Omit<ThemeColorValues, 'scales'>> = {
  'link/visited': 'linkVisited',
  'focus/inner': 'focusInner',
  'focus/outer': 'focusOuter',
};

/**
 * Creates the config that an import of the given collections came from. Throws if the collections aren't
 * from an import, or if the result isn't a valid config.
 */
export function exportConfig(collections: CollectionData[]): ExportedConfig {
  const warnings: string[] = [];
  const collectionByName = new Map(collections.map((c) => [c.name, c]));

  const themeCollection = requireCollection(
    collectionByName,
    FIGMA_COLLECTION.THEME,
  );
  const colorScheme = requireCollection(
    collectionByName,
    FIGMA_COLLECTION.COLOR_SCHEME,
  );
  const schemeModes: Record<ColorScheme, string> = {
    light: requireMode(colorScheme, 'Light'),
    dark: requireMode(colorScheme, 'Dark'),
  };

  if (themeCollection.modes.length === 0) {
    throw new Error(`The ${FIGMA_COLLECTION.THEME} collection has no modes.`);
  }

  for (const collection of collections) {
    if (!KNOWN_COLLECTIONS.has(collection.name)) {
      warnings.push(
        `Collection "${collection.name}" isn't created by an import, so it isn't in the config.`,
      );
    }
  }

  const resolve = createResolver(collectionByName);
  const themes: Record<string, ThemeConfig> = {};

  for (const themeName of themeCollection.modes) {
    const { warnings: colorWarnings, ...colors } = configColorsFromValues(
      readThemeColors(themeName, colorScheme, schemeModes, resolve, warnings),
    );
    warnings.push(
      ...colorWarnings.map((warning) => `Theme "${themeName}": ${warning}`),
    );
    themes[themeName] = {
      ...colors,
      ...extractTypography(themeName, resolve),
      ...extractBorderRadius(themeName, resolve),
    };
  }

  const config: ExportedConfig['config'] = {
    $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
    themes,
  };

  // Validate like a pasted config, so the file is one the plugin and the CLI accept.
  validateConfig(externalConfigSchema, config);

  return { config, warnings };
}

/** A theme's colors in the Color scheme collection, per color scheme. */
function readThemeColors(
  themeName: string,
  colorScheme: CollectionData,
  schemeModes: Record<ColorScheme, string>,
  resolve: Resolve,
  warnings: string[],
): ThemeColorValues {
  const prefix = `${themeName}/`;
  const values: ThemeColorValues = { scales: new Map() };

  for (const variable of colorScheme.variables) {
    if (!variable.name.startsWith(prefix)) {
      continue;
    }

    const schemeColors: SchemeColors = {};
    for (const scheme of SCHEMES) {
      const hex = toHex(
        resolve(colorScheme.name, variable.name, schemeModes[scheme]),
      );
      if (hex) {
        schemeColors[scheme] = hex;
      }
    }

    const name = variable.name.slice(prefix.length);
    const [, colorName, step] = /^(.+)\/([^/]+)$/.exec(name) ?? [];
    const stepName = step && toStepName(step);
    if (colorName && stepName) {
      const steps = values.scales.get(colorName) ?? new Map();
      values.scales.set(colorName, steps);
      steps.set(stepName, schemeColors);
    } else if (name in OTHER_COLORS) {
      values[OTHER_COLORS[name]] = schemeColors;
    } else {
      warnings.push(
        `Variable "${colorScheme.name}/${variable.name}" isn't created by an import, so it isn't in the config.`,
      );
    }
  }

  return values;
}

function extractTypography(
  themeName: string,
  resolve: Resolve,
): Pick<ThemeConfig, 'typography'> {
  const fontFamily = resolve(FIGMA_COLLECTION.THEME, 'font-family', themeName);
  return typeof fontFamily === 'string' && fontFamily !== defaultFontFamily
    ? { typography: { fontFamily } }
    : {};
}

function extractBorderRadius(
  themeName: string,
  resolve: Resolve,
): Pick<ThemeConfig, 'borderRadius'> {
  const base = resolve(FIGMA_COLLECTION.THEME, 'border-radius/base', themeName);
  return typeof base === 'number' && base !== defaultBorderRadius
    ? { borderRadius: base }
    : {};
}

type Resolve = (
  collection: string,
  variable: string,
  mode: string,
) => VariableValue | undefined;

// Follows aliases to a raw value. An alias resolves in the target collection's default (first) mode,
// as Figma does when nothing else sets the mode.
function createResolver(
  collectionByName: Map<string, CollectionData>,
): Resolve {
  const variablesByCollection = new Map(
    [...collectionByName].map(([name, collection]) => [
      name,
      new Map<string, VariableData>(
        collection.variables.map((variable) => [variable.name, variable]),
      ),
    ]),
  );

  const resolve = (
    collection: string,
    variable: string,
    mode: string,
    depth: number,
  ): VariableValue | undefined => {
    const value = variablesByCollection.get(collection)?.get(variable)
      ?.valuesByMode[mode];
    // The depth guards against alias loops, which Figma doesn't allow but hand-made data could have.
    if (!value || depth > 10) {
      return undefined;
    }
    if (value.kind === 'raw') {
      return value.value;
    }
    const defaultMode = collectionByName.get(value.collection)?.modes[0];
    return defaultMode
      ? resolve(value.collection, value.name, defaultMode, depth + 1)
      : undefined;
  };

  return (collection, variable, mode) => resolve(collection, variable, mode, 0);
}

function requireCollection(
  collectionByName: Map<string, CollectionData>,
  name: string,
): CollectionData {
  const collection = collectionByName.get(name);
  if (!collection) {
    throw new Error(
      `No "${name}" collection found. A config can only be created from a file that a config has been imported into.`,
    );
  }
  return collection;
}

function requireMode(collection: CollectionData, name: string): string {
  const mode = collection.modes.find(
    (mode) => mode.toLowerCase() === name.toLowerCase(),
  );
  if (!mode) {
    throw new Error(
      `The "${collection.name}" collection has no "${name}" mode.`,
    );
  }
  return mode;
}

/** The step name for a step number or name in a variable name, or undefined if it's neither. */
function toStepName(step: string): SemanticColorNames | undefined {
  return (
    STEP_NAME_BY_NUMBER.get(step) ??
    (step in semanticColorSpec ? (step as SemanticColorNames) : undefined)
  );
}

/** Figma's 0-1 RGBA as lowercase hex, with the alpha only when the color isn't opaque. */
function toHex(value: VariableValue | undefined): CssColor | undefined {
  if (typeof value !== 'object' || value === null || !('r' in value)) {
    return undefined;
  }
  const channel = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  const alpha = 'a' in value && value.a < 1 ? channel(value.a) : '';
  return `#${channel(value.r)}${channel(value.g)}${channel(value.b)}${alpha}`;
}
