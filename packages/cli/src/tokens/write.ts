import fs from 'node:fs/promises';
import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import type { ColorScheme } from '../colors/types.js';
import type { Collection, File, Theme, Tokens, TokensSet, TypographyModes } from './types.js';
import { cp, mkdir, writeFile } from './utils.js';
import { generateMetadataJson } from './write/generate$metadata.js';
import { generateThemesJson } from './write/generate$themes.js';

const DIRNAME: string = import.meta.dirname || __dirname;

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

const generateColorSchemeFile = (scheme: ColorScheme, name: Collection, tokens: TokensSet, outPath: string): File => {
  const path = `${outPath}/primitives/modes/color-scheme/${scheme}`;
  return {
    data: stringify(tokens),
    dir: path,
    path: `${path}/${name}.json`,
  };
};

const generateTypographyFile = (
  folder: TypographyModes,
  name: Collection,
  tokens: TokensSet,
  outPath: string,
): File => {
  const path = `${outPath}/primitives/modes/typography/${folder}`;
  return {
    data: stringify(tokens),
    dir: path,
    path: `${path}/${name}.json`,
  };
};

type WriteTokensOptions = {
  outDir: string;
  tokens: Tokens;
  theme: Theme;
  /** Dry run, no files will be written */
  dry?: boolean;
};

export const writeTokens = async (options: WriteTokensOptions) => {
  const {
    outDir,
    tokens,
    theme: { name: themeName, colors, borderRadius },
    dry,
  } = options;
  const targetDir = path.resolve(process.cwd(), String(outDir));
  const $themesPath = path.join(targetDir, '$themes.json');
  const $metadataPath = path.join(targetDir, '$metadata.json');
  let themes = [themeName];

  await mkdir(targetDir, dry);

  // Copy default files
  await cp(path.join(DIRNAME, './template/design-tokens'), targetDir, dry, (src) => !src.includes('template.json'));

  try {
    // Update with existing themes
    const $themes = await fs.readFile($themesPath, 'utf-8');
    const themeObjects = (JSON.parse($themes) as ThemeObject[]) || [];
    const concatThemeNames = R.pipe(
      R.filter((obj: ThemeObject) => R.toLower(obj.group || '') === 'theme'),
      R.map(R.prop('name')),
      R.concat(themes),
      R.uniq,
    );

    themes = concatThemeNames(themeObjects);
  } catch (error) {
    console.error(`Error concatenating theme names: ${error}`);
  }

  console.log(`Themes: ${chalk.blue(themes.join(', '))}`);

  // Create metadata and themes json for Token Studio and build script
  const $theme = generateThemesJson(['dark', 'light'], themes, colors);
  const $metadata = generateMetadataJson(['dark', 'light'], themes, colors);

  await writeFile($themesPath, stringify($theme), dry);
  await writeFile($metadataPath, stringify($metadata), dry);

  /*
   * Colors
   */

  // Create main-color and support-color modes for the custom colors

  for (const mode of Object.entries(tokens.semantic?.modes || {})) {
    const [category, colors] = mode;
    const categoryPath = path.join(targetDir, 'semantic', 'modes', category);
    await mkdir(categoryPath, dry);

    for (const [colorName, color] of Object.entries(colors)) {
      await writeFile(path.join(categoryPath, `${colorName}.json`), stringify(color), dry);
    }
  }

  // Create semantic color file
  await writeFile(path.join(targetDir, `semantic/color.json`), stringify(tokens.semantic.color || {}), dry);

  // Create theme file
  await mkdir(path.join(targetDir, 'themes'), dry);
  await writeFile(path.join(targetDir, `themes/${themeName}.json`), stringify(tokens.themes[themeName] || {}), dry);

  // Create color scheme and typography modes
  const colorScheme = tokens.primitives['colors-scheme'];
  const typography = tokens.primitives.typography;

  const files: File[] = [
    generateColorSchemeFile('light', themeName, colorScheme.light[themeName], targetDir),
    generateColorSchemeFile('light', 'global', colorScheme.light.global, targetDir),
    generateColorSchemeFile('dark', themeName, colorScheme.dark[themeName], targetDir),
    generateColorSchemeFile('dark', 'global', colorScheme.dark.global, targetDir),
    // generateColorSchemeFile('contrast', themeName, colorScheme.contrast[themeName], targetDir),
    // generateColorSchemeFile('contrast', 'global', colorScheme.contrast.global, targetDir),
    generateTypographyFile('primary', themeName, typography.primary, targetDir),
    generateTypographyFile('secondary', themeName, typography.secondary, targetDir),
  ];

  for (const file of files) {
    await mkdir(path.resolve(file.dir), dry);
    await writeFile(path.resolve(file.path), file.data, dry);
  }

  console.log(
    `Finished creating Designsystem design tokens in ${chalk.green(outDir)} for theme ${chalk.blue(themeName)}`,
  );
};
