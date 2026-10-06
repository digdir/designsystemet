import {
  type ColorScheme,
  type CssColor,
  defaultBorderRadius,
  defaultFontFamily,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
  FIGMA_COLLECTION,
  generateColorScale,
  type SemanticColorNames,
  type SeverityColorNames,
  semanticColorSpec,
  severityColors,
  validateConfig,
  visitedLinkColor,
} from '@digdir/designsystemet/internal';
import pkg from '@digdir/designsystemet/package.json';
import type { CollectionData, VariableData } from './types';

// Rebuilds a config from the variables a sync created. Each theme is a mode in the Theme collection,
// and its colors are in the Color scheme collection as `<theme>/<color>/<1-16>`. The config holds only
// each color's base color (`base-default` in Light, which is the input color unchanged); every other step
// is generated from it. Steps that differ from the generated scale, e.g. ones edited by hand in Figma,
// become `overrides`. Values that match the defaults are left out, like the theme builder does.

type ThemeConfig = NonNullable<ExternalConfigSchemaInput['themes']>[string];
type Overrides = NonNullable<ThemeConfig['overrides']>;
type SchemeColors = Partial<Record<ColorScheme, CssColor>>;

export type ExtractedConfig = {
  config: ExternalConfigSchemaInput & { $schema: string };
  /** What is in the file but can't be described by the config, and so is left out of it. */
  warnings: string[];
};

const SCHEMES: ColorScheme[] = ['light', 'dark'];
const BASE_STEP = semanticColorSpec['base-default'].name;
// Variables are named by step number today (`<theme>/<color>/12`). Step names (`<theme>/<color>/base-default`)
// are planned, so both are read, and the extraction itself works with step names.
const STEP_NAME_BY_NUMBER = new Map(
  Object.values(semanticColorSpec).map((step) => [
    String(step.number),
    step.name,
  ]),
);
const KNOWN_COLLECTIONS = new Set<string>(Object.values(FIGMA_COLLECTION));
// Non-numbered colors in each theme's part of the Color scheme collection.
const LINK_VISITED = 'link/visited';
const FOCUS_INNER = 'focus/inner';
const FOCUS_OUTER = 'focus/outer';

/**
 * Creates the config that a sync of the given collections came from. Throws if the collections aren't
 * from a sync, or if the result isn't a valid config.
 */
export function extractConfig(collections: CollectionData[]): ExtractedConfig {
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
        `Collection "${collection.name}" isn't created by a sync, so it isn't in the config.`,
      );
    }
  }

  const resolve = createResolver(collectionByName);
  const themes: Record<string, ThemeConfig> = {};

  for (const themeName of themeCollection.modes) {
    const colorValues = readThemeColors(
      themeName,
      colorScheme,
      schemeModes,
      resolve,
      warnings,
    );
    themes[themeName] = {
      ...extractColors(themeName, colorValues, warnings),
      ...extractTypography(themeName, resolve),
      ...extractBorderRadius(themeName, resolve),
    };
  }

  const config: ExtractedConfig['config'] = {
    $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
    themes,
  };

  // Validate like a pasted config, so the file is one the plugin and the CLI accept.
  validateConfig(externalConfigSchema, config);

  return { config, warnings };
}

/** A theme's colors in the Color scheme collection, per color scheme. */
type ThemeColorValues = {
  /** Steps per color name, e.g. `accent` → `base-default` → { light, dark }. */
  steps: Map<string, Map<SemanticColorNames, SchemeColors>>;
  /** The colors that aren't numbered steps: link and focus. */
  other: Map<string, SchemeColors>;
};

function readThemeColors(
  themeName: string,
  colorScheme: CollectionData,
  schemeModes: Record<ColorScheme, string>,
  resolve: Resolve,
  warnings: string[],
): ThemeColorValues {
  const prefix = `${themeName}/`;
  const steps = new Map<string, Map<SemanticColorNames, SchemeColors>>();
  const other = new Map<string, SchemeColors>();

  for (const variable of colorScheme.variables) {
    if (!variable.name.startsWith(prefix)) {
      continue;
    }

    const values: SchemeColors = {};
    for (const scheme of SCHEMES) {
      const hex = toHex(
        resolve(colorScheme.name, variable.name, schemeModes[scheme]),
      );
      if (hex) {
        values[scheme] = hex;
      }
    }

    const name = variable.name.slice(prefix.length);
    const [, colorName, step] = /^(.+)\/([^/]+)$/.exec(name) ?? [];
    const stepName = step && toStepName(step);
    if (colorName && stepName) {
      if (!steps.has(colorName)) {
        steps.set(colorName, new Map());
      }
      steps.get(colorName)?.set(stepName, values);
    } else if ([LINK_VISITED, FOCUS_INNER, FOCUS_OUTER].includes(name)) {
      other.set(name, values);
    } else {
      warnings.push(
        `Variable "${colorScheme.name}/${variable.name}" isn't created by a sync, so it isn't in the config.`,
      );
    }
  }

  return { steps, other };
}

function extractColors(
  themeName: string,
  { steps, other }: ThemeColorValues,
  warnings: string[],
): Pick<ThemeConfig, 'colors' | 'overrides'> {
  const colors: Record<string, CssColor> = {};
  const overrides: Overrides = {};

  for (const [colorName, colorSteps] of steps) {
    const base = colorSteps.get(BASE_STEP)?.light;
    if (!base) {
      warnings.push(
        `Theme "${themeName}": color "${colorName}" has no base color (${BASE_STEP} in Light), so it isn't in the config.`,
      );
      continue;
    }

    // Severity colors are always generated, so they are only in the config when they aren't the default.
    if (isSeverityColor(colorName)) {
      if (!isSameColor(base, severityColors[colorName])) {
        overrides.severity = { ...overrides.severity, [colorName]: base };
      }
    } else {
      colors[colorName] = base;
    }

    // Steps that differ from the scale generated from the base color are overrides.
    for (const scheme of SCHEMES) {
      const scale = generateColorScale(base, scheme);
      for (const [stepName, step] of Object.entries(scale) as [
        SemanticColorNames,
        (typeof scale)[SemanticColorNames],
      ][]) {
        const actual = colorSteps.get(stepName)?.[scheme];
        if (actual && !isSameColor(actual, step.hex)) {
          overrides.colors ??= {};
          overrides.colors[colorName] ??= {};
          overrides.colors[colorName][stepName] = {
            ...overrides.colors[colorName][stepName],
            [scheme]: actual,
          };
        }
      }
    }
  }

  const linkVisited = diffFromDefaults(
    other.get(LINK_VISITED),
    (scheme) =>
      generateColorScale(visitedLinkColor, scheme)['base-default'].hex,
  );
  if (linkVisited) {
    overrides.linkVisited = linkVisited;
  }

  // The focus colors default to neutral's background and text colors, after any overrides,
  // which are the values already in Figma.
  const neutral = steps.get('neutral');
  const focusInner = diffFromDefaults(
    other.get(FOCUS_INNER),
    (scheme) => neutral?.get('background-default')?.[scheme],
  );
  const focusOuter = diffFromDefaults(
    other.get(FOCUS_OUTER),
    (scheme) => neutral?.get('text-default')?.[scheme],
  );
  if (focusInner || focusOuter) {
    overrides.focus = {
      ...(focusInner && { inner: focusInner }),
      ...(focusOuter && { outer: focusOuter }),
    };
  }

  return {
    colors,
    ...(Object.keys(overrides).length > 0 && { overrides }),
  };
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

/** The colors that differ from their defaults, or undefined if none do. */
function diffFromDefaults(
  values: SchemeColors | undefined,
  getDefault: (scheme: ColorScheme) => CssColor | undefined,
): SchemeColors | undefined {
  const diff: SchemeColors = {};
  for (const scheme of SCHEMES) {
    const actual = values?.[scheme];
    const fallback = getDefault(scheme);
    if (actual && (!fallback || !isSameColor(actual, fallback))) {
      diff[scheme] = actual;
    }
  }
  return Object.keys(diff).length > 0 ? diff : undefined;
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
      `No "${name}" collection found. A config can only be created from a file that has been synced from a config.`,
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

function isSeverityColor(name: string): name is SeverityColorNames {
  return name in severityColors;
}

function isSameColor(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
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
