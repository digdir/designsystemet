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
import { buildCollectionSpecs } from '../import/collection-specs';
import { createTokenModel } from '../import/create-token-model';
import { createImportLog } from '../import/log';
import { getTokenSetLookupOrder } from '../import/resolver';
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
// A Map, so a variable named e.g. `<theme>/constructor` can't match a property every object has.
const OTHER_COLORS = new Map<string, keyof Omit<ThemeColorValues, 'scales'>>([
  ['link/visited', 'linkVisited'],
  ['focus/inner', 'focusInner'],
  ['focus/outer', 'focusOuter'],
]);

/**
 * Creates the config that an import of the given collections came from. Throws if the collections aren't
 * from an import, or if the result isn't a valid config. Warns about what's in the file but not in the config,
 * as importing the config wouldn't bring it back.
 */
export async function exportConfig(
  collections: CollectionData[],
): Promise<ExportedConfig> {
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
      continue;
    }
    // The export can't follow these aliases, so it reads these values as missing, and the config may use a
    // default instead, e.g. for a font family.
    for (const { name, externalAliasModes } of collection.variables) {
      if (externalAliasModes) {
        warnings.push(
          `Variable "${collection.name}/${name}" refers to a variable outside this file, such as a library, in ${externalAliasModes.join(', ')}, so that value isn't in the config.`,
        );
      }
    }
  }

  const resolve = createResolver(collectionByName);
  // A Map, as theme names are Figma mode names, which could be any name, e.g. `constructor`.
  // Object.fromEntries below only adds own properties.
  const themes = new Map<string, ThemeConfig>();

  for (const themeName of themeCollection.modes) {
    // The config schema drops a `__proto__` key, like JSON tools commonly do, so no config can have this theme.
    if (themeName === '__proto__') {
      warnings.push(
        `Theme "${themeName}" isn't in the config, as a config can't have a theme with that name. Rename the mode in the ${FIGMA_COLLECTION.THEME} collection to include it.`,
      );
      continue;
    }
    const { warnings: colorWarnings, ...colors } = configColorsFromValues(
      readThemeColors(themeName, colorScheme, schemeModes, resolve),
    );
    warnings.push(
      ...colorWarnings.map((warning) => `Theme "${themeName}": ${warning}`),
    );
    themes.set(themeName, {
      ...colors,
      ...extractTypography(themeName, resolve),
      ...extractBorderRadius(themeName, resolve),
    });
  }

  const config: ExportedConfig['config'] = {
    $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
    themes: Object.fromEntries(themes),
  };

  // Validate like a pasted config, so the file is one the plugin and the CLI accept.
  validateConfig(externalConfigSchema, config);
  warnings.push(...(await compareWithImport(collections, config)));

  return { config, warnings };
}

/**
 * How the file differs from what an import of the config would create. Found by building the collections from the
 * config with the import's own code, as most of them (e.g. Size and Semantic) are generated from the config, not
 * read into it. Reports, in the collections an import manages:
 * - modes and variables an import wouldn't create, e.g. ones added by hand, which the config leaves out.
 * - collections, modes and variables an import would create that aren't in the file, e.g. ones deleted by hand,
 *   which importing the config brings back.
 * Collections an import doesn't create are reported by exportConfig, and missing color steps by the color code.
 */
async function compareWithImport(
  collections: CollectionData[],
  config: ExportedConfig['config'],
): Promise<string[]> {
  const model = await createTokenModel(JSON.stringify(config));
  const specs = buildCollectionSpecs(
    model,
    getTokenSetLookupOrder(model),
    createImportLog(),
  );
  const collectionByName = new Map(collections.map((c) => [c.name, c]));

  const warnings: string[] = [];
  for (const spec of specs) {
    const collection = collectionByName.get(spec.name);
    if (!collection) {
      warnings.push(
        `Collection "${spec.name}" isn't in this file, so importing the config creates it.`,
      );
      continue;
    }

    const modeNames = new Set(spec.modeNames);
    for (const mode of collection.modes) {
      // A theme named `__proto__` is reported when the themes are read.
      const reported =
        mode === '__proto__' && collection.name === FIGMA_COLLECTION.THEME;
      if (!modeNames.has(mode) && !reported) {
        warnings.push(
          `Mode "${collection.name}/${mode}" isn't created by an import, so it isn't in the config.`,
        );
      }
    }

    const variableNames = new Set<string>();
    for (const variable of collection.variables) {
      const name = toImportedName(collection.name, variable.name);
      variableNames.add(name);
      if (!spec.variables.has(name)) {
        warnings.push(
          `Variable "${collection.name}/${variable.name}" isn't created by an import, so it isn't in the config.`,
        );
      }
    }

    const fileModes = new Set(collection.modes);
    const missingModes = spec.modeNames.filter((mode) => !fileModes.has(mode));
    if (missingModes.length > 0) {
      warnings.push(missingWarning('mode', missingModes, collection.name));
    }
    const missingVariables = [...spec.variables.keys()].filter(
      (name) => !variableNames.has(name) && !isColorStep(collection.name, name),
    );
    if (missingVariables.length > 0) {
      warnings.push(
        missingWarning('variable', missingVariables, collection.name),
      );
    }
  }
  return warnings;
}

/** E.g. "2 variables in Theme aren't in this file, so importing the config creates them: a, b". */
function missingWarning(
  kind: 'mode' | 'variable',
  names: string[],
  collectionName: string,
): string {
  const one = names.length === 1;
  return `${names.length} ${kind}${one ? '' : 's'} in ${collectionName} ${one ? "isn't" : "aren't"} in this file, so importing the config creates ${one ? 'it' : 'them'}: ${names.join(', ')}`;
}

/** Whether a variable is a numbered color step, e.g. `<theme>/<color>/12` in Color scheme. */
function isColorStep(collectionName: string, variableName: string): boolean {
  return (
    collectionName === FIGMA_COLLECTION.COLOR_SCHEME &&
    STEP_NAME_BY_NUMBER.has(variableName.split('/').at(-1) ?? '')
  );
}

/**
 * The name an import gives a variable. Color scheme steps can be named by step name (`<theme>/<color>/base-default`)
 * as well as by number, which is what an import names them today (`<theme>/<color>/12`).
 */
function toImportedName(collectionName: string, variableName: string): string {
  if (collectionName !== FIGMA_COLLECTION.COLOR_SCHEME) {
    return variableName;
  }
  const [, prefix, step] = /^(.+\/)([^/]+)$/.exec(variableName) ?? [];
  return prefix && step && Object.hasOwn(semanticColorSpec, step)
    ? `${prefix}${semanticColorSpec[step as SemanticColorNames].number}`
    : variableName;
}

/** A theme's colors in the Color scheme collection, per color scheme. */
function readThemeColors(
  themeName: string,
  colorScheme: CollectionData,
  schemeModes: Record<ColorScheme, string>,
  resolve: Resolve,
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
    const otherColor = OTHER_COLORS.get(name);
    if (colorName && stepName) {
      const steps = values.scales.get(colorName) ?? new Map();
      values.scales.set(colorName, steps);
      steps.set(stepName, schemeColors);
    } else if (otherColor) {
      values[otherColor] = schemeColors;
    }
    // Other variables aren't in the config; compareWithImport reports them.
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

// Follows aliases to a raw value, resolving modes as Figma does: an alias to a variable in the same collection
// resolves in the same mode (a Dark alias gives the target's Dark value). An alias to another collection
// resolves in that collection's default (first) mode, as nothing else sets its mode here.
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
    const valuesByMode = variablesByCollection
      .get(collection)
      ?.get(variable)?.valuesByMode;
    // Own properties only, so a mode named like a property every object has, e.g. `constructor`, isn't found
    // on a variable without a value for it.
    const value =
      valuesByMode && Object.hasOwn(valuesByMode, mode)
        ? valuesByMode[mode]
        : undefined;
    // The depth guards against alias loops, which Figma doesn't allow but hand-made data could have.
    if (!value || depth > 10) {
      return undefined;
    }
    if (value.kind === 'raw') {
      return value.value;
    }
    const targetMode =
      value.collection === collection
        ? mode
        : collectionByName.get(value.collection)?.modes[0];
    return targetMode
      ? resolve(value.collection, value.name, targetMode, depth + 1)
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
    // Own properties only, so names every object has, like `constructor`, aren't steps.
    (Object.hasOwn(semanticColorSpec, step)
      ? (step as SemanticColorNames)
      : undefined)
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
