import path from 'node:path';
import pc from 'picocolors';
import type { CssColor } from '../colors/types.js';
import type { CreateConfigSchema } from '../schemas/v1.1/schema.js';
import { dsfs } from '../utils/filesystem.js';

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
 * Categorizes colors into main, support, and neutral based on color names
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
  outFile?: string;
};

/**
 * Generates a config file from existing design tokens
 */
export async function generateConfigFromTokens(options: GenerateConfigOptions): Promise<CreateConfigSchema> {
  const { tokensDir } = options;

  console.log(`\nReading tokens from ${pc.blue(tokensDir)}`);

  // Discover themes
  const themes = await discoverThemes(tokensDir);

  if (themes.length === 0) {
    throw new Error(`\nNo themes found in ${pc.blue(tokensDir)}`);
  }

  console.log(`\nFound ${pc.green(String(themes.length))} theme(s): ${themes.map((t) => pc.cyan(t)).join(', ')}`);

  // Generate config for each theme
  const config: CreateConfigSchema = {
    outDir: tokensDir,
    themes: {},
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

    config.themes[themeName] = {
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
