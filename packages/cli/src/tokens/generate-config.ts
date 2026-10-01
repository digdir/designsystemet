import path from 'node:path';
import pc from 'picocolors';
import type { CssColor } from '../colors/types.ts';
import { toOutput } from '../migrations/new-output-field.ts';
import type { ExternalConfigSchemaInput } from '../schemas/schema.ts';
import { dsfs } from '../utils/filesystem.ts';
import { isSameOrInside } from '../utils/paths.ts';

type TokenValue = {
  $type: string;
  $value: string;
};

type TokenObject = {
  [key: string]: TokenValue | TokenObject;
};

/**
 * Reads a JSON file and returns its content as an object
 */
async function readJsonFile(filePath: string): Promise<TokenObject> {
  try {
    const content = await dsfs.readFile(filePath);
    return JSON.parse(content) as TokenObject;
  } catch (err) {
    throw new Error(`Failed to read token file at ${filePath}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Extract the base hex color from a color scale (color.12)
 */
function extractBaseColor(colorScale: TokenObject): string | null {
  if ('12' in colorScale && typeof colorScale['12'] === 'object' && '$value' in colorScale['12']) {
    const token = colorScale['12'] as TokenValue;
    if (token.$type === 'color') {
      return token.$value;
    }
  }
  return null;
}

/**
 * Discovers theme names from the primitives/modes/color-scheme/light/
 */
async function discoverThemes(tokensDir: string): Promise<string[]> {
  const lightModePath = path.join(tokensDir, 'themes');

  try {
    const files = await dsfs.readdir(lightModePath);
    const themes = files.filter((file) => file.endsWith('.json')).map((file) => file.replace('.json', ''));

    return themes;
  } catch {
    throw new Error(`Could not find themes. Make sure ${pc.blue(lightModePath)} exists and contains theme JSON files.`);
  }
}

/**
 * Reads token information for a specific theme from primitives/modes/color-scheme/light/<theme>.json
 */
async function readThemeTokens(tokensDir: string, themeName: string): Promise<TokenObject> {
  const themePath = path.join(tokensDir, 'primitives', 'modes', 'color-scheme', 'light', `${themeName}.json`);
  return readJsonFile(themePath);
}

/**
 * Reads the theme configuration from themes/<theme>.json
 */
async function readThemeConfig(tokensDir: string, themeName: string): Promise<TokenObject | null> {
  const themeConfigPath = path.join(tokensDir, 'themes', `${themeName}.json`);

  try {
    return await readJsonFile(themeConfigPath);
  } catch {
    return null;
  }
}

/**
 * Extract border-radius base value from theme config
 */
function extractBorderRadius(themeConfig: TokenObject | null): number | undefined {
  if (!themeConfig || !('border-radius' in themeConfig)) {
    return undefined;
  }

  const borderRadius = themeConfig['border-radius'] as TokenObject;
  if ('base' in borderRadius && typeof borderRadius.base === 'object' && '$value' in borderRadius.base) {
    const token = borderRadius.base as TokenValue;
    return Number(token.$value);
  }

  return undefined;
}

/**
 * Extract font family from theme config
 */
function extractFontFamily(themeConfig: TokenObject | null): string | undefined {
  if (!themeConfig || !('font-family' in themeConfig)) {
    return undefined;
  }

  const fontFamily = themeConfig['font-family'];
  if (typeof fontFamily === 'object' && '$value' in fontFamily) {
    const token = fontFamily as TokenValue;
    const value = token.$value;

    if (value.startsWith('{') && value.endsWith('}')) {
      return undefined;
    }
    return value;
  }

  return undefined;
}

/**
 * Reads the typography configuration from primitives/modes/typography/primary/<theme>.json
 */
async function readTypographyConfig(tokensDir: string, themeName: string): Promise<TokenObject | null> {
  const typographyConfigPath = path.join(
    tokensDir,
    'primitives',
    'modes',
    'typography',
    'primary',
    `${themeName}.json`,
  );

  try {
    return await readJsonFile(typographyConfigPath);
  } catch {
    return null;
  }
}

/**
 * Extract font family from typography primitives
 */
function extractFontFamilyFromPrimitives(typographyConfig: TokenObject | null, themeName: string): string | undefined {
  if (!typographyConfig) {
    return undefined;
  }

  const themeTypography = typographyConfig[themeName] as TokenObject | undefined;
  if (!themeTypography || !('font-family' in themeTypography)) {
    return undefined;
  }

  const fontFamily = themeTypography['font-family'];
  if (typeof fontFamily === 'object' && '$value' in fontFamily) {
    const token = fontFamily as TokenValue;
    return token.$value;
  }

  return undefined;
}

/**
 * Extracts colors from the theme tokens, excluding reserved colors and extracting base colors from color scales.
 */
function extractColors(themeTokens: TokenObject, themeName: string): Record<string, CssColor> {
  const colors: Record<string, CssColor> = {};

  // Reserved colors
  const specialKeys = ['link'];

  const themeColors = themeTokens[themeName] as TokenObject | undefined;
  if (!themeColors) {
    return colors;
  }

  for (const [colorName, colorValue] of Object.entries(themeColors)) {
    if (specialKeys.includes(colorName)) {
      continue;
    }

    if (typeof colorValue === 'object' && !('$value' in colorValue)) {
      const baseColor = extractBaseColor(colorValue as TokenObject);

      if (baseColor) {
        colors[colorName] = baseColor as CssColor;
      }
    }
  }

  return colors;
}

type GenerateConfigOptions = {
  tokensDir: string;
  /** Path of the config file. Paths in the generated config are relative to it. */
  outFile?: string;
};

/**
 * Returns `tokensDir` relative to `configDir`, as paths are written in a config: relative to the config file,
 * with forward slashes so the config works on any OS.
 *
 * Throws when `configDir` is the tokens directory or inside it. The generated `design-tokens` output would then
 * point to the config's own directory or a parent of it, which `cleanDir` deletes before creating design tokens.
 */
export const toConfigTokensDir = (tokensDir: string, configDir: string): string => {
  const absoluteTokensDir = path.resolve(tokensDir);

  if (isSameOrInside(configDir, absoluteTokensDir)) {
    throw new Error(
      `The config file can't be placed inside the design tokens directory ${pc.blue(absoluteTokensDir)}, since running the config would delete that directory. Use ${pc.blue('--out')} to place the config file outside it.`,
    );
  }

  return path.relative(path.resolve(configDir), absoluteTokensDir).split(path.sep).join('/');
};

/**
 * Generates a config file from existing design tokens
 */
export async function generateConfigFromTokens(options: GenerateConfigOptions): Promise<ExternalConfigSchemaInput> {
  const { tokensDir, outFile } = options;

  // Check the paths before reading any tokens, so an unsafe `--out` fails right away.
  const configDir = outFile ? path.dirname(path.resolve(outFile)) : process.cwd();
  const relativeTokensDir = toConfigTokensDir(tokensDir, configDir);

  console.log(`\nReading tokens from ${pc.blue(tokensDir)}`);

  // Discover themes
  const themes = await discoverThemes(tokensDir);

  if (themes.length === 0) {
    throw new Error(`\nNo themes found in ${pc.blue(tokensDir)}`);
  }

  console.log(`\nFound ${pc.green(String(themes.length))} theme(s): ${themes.map((t) => pc.cyan(t)).join(', ')}`);

  // Generate config for each theme
  const configThemes: NonNullable<ExternalConfigSchemaInput['themes']> = {};
  const output = toOutput(relativeTokensDir);
  const config: ExternalConfigSchemaInput = {
    // Omitted when the tokens are in the default directory, since the default `output` covers it.
    ...(output && { output: [...output] }),
    themes: configThemes,
  };

  for (const themeName of themes) {
    console.log(`\nProcessing theme ${pc.cyan(themeName)}...`);

    // Read theme tokens
    const themeTokens = await readThemeTokens(tokensDir, themeName);
    const themeConfig = await readThemeConfig(tokensDir, themeName);
    const typographyConfig = await readTypographyConfig(tokensDir, themeName);

    // Extract colors
    const colors = extractColors(themeTokens, themeName);

    if (!colors.neutral) {
      console.warn(pc.yellow(`\nWarning: No neutral color found for theme ${themeName}`));
      continue; // Skip this theme as neutral is required
    }

    const borderRadius = extractBorderRadius(themeConfig);
    const fontFamily = extractFontFamily(themeConfig) ?? extractFontFamilyFromPrimitives(typographyConfig, themeName);

    configThemes[themeName] = {
      colors,
      borderRadius,
      typography: fontFamily ? { fontFamily } : undefined,
    };

    console.log(
      `\n✅ Colors: ${
        Object.keys(colors)
          .map((c) => pc.cyan(c))
          .join(', ') || pc.dim('none')
      }`,
    );

    if (borderRadius !== undefined) {
      console.log(`\n✅ Border radius: ${pc.cyan(String(borderRadius))}`);
    }
    if (fontFamily) {
      console.log(`\n✅ Font family: ${pc.cyan(fontFamily)}`);
    }
  }

  return config;
}
