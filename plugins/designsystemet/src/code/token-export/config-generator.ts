import type { infer as ZodInfer } from 'zod';
import legacyColorMigration from '../../../node_modules/@digdir/designsystemet/dist/src/migrations/flatten-color-categories.js';
import { configFileCreateSchema } from '../../../node_modules/@digdir/designsystemet/dist/src/schemas/v1.1/schema.js';
import { createTokens } from '../../../node_modules/@digdir/designsystemet/dist/src/tokens/create.js';
import { COLLECTION } from './constants';
import { buildPreview } from './preview-model';
import type { LoadedFile, PreviewData } from './types';
import { parseJsonLike } from './utils';

const GENERATED_ROOT = 'generated-design-tokens';
const SIZE_MODES = ['medium', 'large', 'small'] as const;
const COLOR_SCHEMES = ['dark', 'light'] as const;
const DEFAULT_FONT_FAMILY = 'Inter';
const DEFAULT_BORDER_RADIUS = 4;

export type ConfigSchema = ZodInfer<typeof configFileCreateSchema>;

// Copy for the legacy-config migration prompt comes from the CLI migration so it stays in
// sync with the tool. picocolors may wrap words in ANSI codes; strip them for HTML display.
function stripAnsi(text: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: strip ANSI escape codes from CLI output for HTML display
  return text.replace(/\u001b\[[0-9;]*m/g, '');
}

export const legacyColorMigrationCopy = {
  name: stripAnsi(
    String(legacyColorMigration.name || 'Update color structure'),
  ),
  message: stripAnsi(String(legacyColorMigration.message || '')),
};

// Both detection and flattening are delegated to the CLI's `flatten-color-categories`
// migration so the plugin stays in sync with the tool. The CLI functions use strict
// JSON.parse and throw on invalid input, so `check` is wrapped to fail closed.

// Detects whether the pasted config still uses the old main/support/neutral color
// categories that were removed in @digdir/designsystemet (color categories flattening).
export function isLegacyColorConfig(configText: string): boolean {
  try {
    return legacyColorMigration.check(configText);
  } catch {
    return false;
  }
}

// Flattens a legacy config's per-theme `{ main, support, neutral }` colors into a single
// flat `colors` record, using the CLI migration.
export function migrateLegacyColorConfig(configText: string): string {
  return legacyColorMigration.yes(configText);
}

export async function buildPreviewFromConfigText(
  configText: string,
): Promise<PreviewData> {
  const parsed = parseJsonLike(configText);

  // outDir is required by the CLI schema but meaningless in the plugin — inject a
  // default so users don't need to include CLI-specific fields in their config.
  if (parsed && typeof parsed === 'object' && !('outDir' in parsed)) {
    (parsed as Record<string, unknown>).outDir = './design-tokens';
  }

  const config = configFileCreateSchema.parse(parsed) as ConfigSchema;

  return buildPreviewFromConfig(config);
}

export async function buildPreviewFromConfig(
  config: ConfigSchema,
): Promise<PreviewData> {
  validateThemeColorNames(config);

  const files = await createLoadedFilesFromConfig(config);
  return buildPreview(files);
}

async function createLoadedFilesFromConfig(
  config: ConfigSchema,
): Promise<LoadedFile[]> {
  // Use a Map so that token sets shared across themes (e.g. semantic/color) are only
  // kept once. Theme-specific sets have unique paths (themes/some-org, etc.) and are
  // kept as-is; shared sets are identical across themes so overwriting is safe.
  const fileMap = new Map<string, LoadedFile>();

  // Color names are derived from the generated `semantic/color/<name>` token sets so
  // the auto-generated severity colors (danger, info, success, warning) are included
  // alongside the user-defined colors and neutral.
  const semanticColorNames = new Set<string>();

  for (const [themeName, themeConfig] of Object.entries(config.themes)) {
    const { tokenSets } = await createTokens({
      name: themeName,
      ...themeConfig,
      borderRadius: themeConfig.borderRadius ?? DEFAULT_BORDER_RADIUS,
      typography: {
        fontFamily: themeConfig.typography?.fontFamily ?? DEFAULT_FONT_FAMILY,
      },
    });

    for (const [tokenSetPath, data] of tokenSets.entries()) {
      const file = makeLoadedFile(`${tokenSetPath}.json`, data);
      fileMap.set(file.tokenSetPath, file);

      const colorMatch = /^semantic\/color\/(.+)$/.exec(tokenSetPath);
      if (colorMatch) {
        semanticColorNames.add(colorMatch[1]);
      }
    }
  }

  const files = Array.from(fileMap.values());
  files.push(
    makeLoadedFile(
      '$themes.json',
      buildThemesFile(config, Array.from(semanticColorNames)),
    ),
  );
  files.sort((a, b) => a.path.localeCompare(b.path));

  return files;
}

function makeLoadedFile(path: string, data: unknown): LoadedFile {
  return {
    path: `${GENERATED_ROOT}/${path}`,
    tokenSetPath: path.replace(/\.jsonc?$/i, ''),
    size: JSON.stringify(data).length,
    data,
  };
}

function buildThemesFile(
  config: ConfigSchema,
  colorNames: string[],
): Array<Record<string, unknown>> {
  const themeNames = Object.keys(config.themes);

  return [
    ...SIZE_MODES.map((size) => ({
      name: size,
      selectedTokenSets: {
        [`primitives/modes/size/${size}`]: 'source',
        'primitives/modes/size/global': 'enabled',
        [`primitives/modes/typography/size/${size}`]: 'enabled',
      },
      group: COLLECTION.SIZE,
    })),
    ...themeNames.map((themeName) => ({
      name: themeName,
      selectedTokenSets: {
        [`themes/${themeName}`]: 'enabled',
      },
      group: COLLECTION.THEME,
    })),
    {
      name: 'Primary',
      selectedTokenSets: Object.fromEntries(
        themeNames.map((themeName) => [
          `primitives/modes/typography/primary/${themeName}`,
          'enabled',
        ]),
      ),
      group: COLLECTION.TYPOGRAPHY,
    },
    {
      name: 'Secondary',
      selectedTokenSets: Object.fromEntries(
        themeNames.map((themeName) => [
          `primitives/modes/typography/secondary/${themeName}`,
          'enabled',
        ]),
      ),
      group: COLLECTION.TYPOGRAPHY,
    },
    ...COLOR_SCHEMES.map((scheme) => ({
      name: capitalize(scheme),
      selectedTokenSets: Object.fromEntries(
        themeNames.map((themeName) => [
          `primitives/modes/color-scheme/${scheme}/${themeName}`,
          'enabled',
        ]),
      ),
      group: COLLECTION.COLOR_SCHEME,
    })),
    {
      name: COLLECTION.SEMANTIC,
      selectedTokenSets: {
        'semantic/style': 'enabled',
        'primitives/globals': 'source',
      },
      group: COLLECTION.SEMANTIC,
    },
    ...colorNames.map((colorName) => ({
      name: colorName,
      selectedTokenSets: {
        [`semantic/color/${colorName}`]: 'enabled',
      },
      group: COLLECTION.COLOR,
    })),
  ];
}

function validateThemeColorNames(config: ConfigSchema): void {
  const entries = Object.entries(config.themes);
  if (entries.length <= 1) {
    return;
  }

  const [firstThemeName, firstTheme] = entries[0];
  const expectedNames = getColorNames(firstTheme);

  for (const [themeName, themeConfig] of entries.slice(1)) {
    const actualNames = getColorNames(themeConfig);
    if (!areStringArraysEqual(expectedNames, actualNames)) {
      throw new Error(
        `Alle themes i config må ha de samme fargenavnene. ${firstThemeName} har [${expectedNames.join(', ')}], mens ${themeName} har [${actualNames.join(', ')}].`,
      );
    }
  }
}

function getColorNames(theme: ConfigSchema['themes'][string]): string[] {
  return Object.keys(theme.colors).sort((a, b) => a.localeCompare(b));
}

function areStringArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((value, index) => value === b[index]);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
