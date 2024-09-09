import fs from 'node:fs/promises';
import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import type { ColorMode } from '../colors/types.js';
import type { Collection, File, Tokens, TokensSet, TypographyModes } from './types.js';
import { generateMetadataJson } from './write/generate$metadata.js';
import { generateThemesJson } from './write/generate$themes.js';

const DIRNAME: string = import.meta.dirname || __dirname;
const DEFAULT_FILES_PATH = path.join(DIRNAME, './design-tokens/default');
const TEMPLATE_FILES_PATH = path.join(DIRNAME, './design-tokens/template/');

export const stringify = (data: unknown) => JSON.stringify(data, null, 2).replace(/\r\n/g, '');

const generateColorModeFile = (folder: ColorMode, name: Collection, tokens: TokensSet, outPath: string): File => {
  const path = `${outPath}/primitives/modes/colors/${folder}`;
  return {
    data: stringify(tokens),
    path,
    filePath: `${path}/${name}.json`,
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
    path,
    filePath: `${path}/${name}.json`,
  };
};

type WriteTokensOptions = {
  writeDir: string;
  tokens: Tokens;
  themeName: string;
};

export const writeTokens = async (options: WriteTokensOptions) => {
  const { writeDir, tokens, themeName } = options;
  const targetDir = path.resolve(process.cwd(), String(writeDir));
  const $themesPath = path.join(targetDir, '$themes.json');
  const $metadataPath = path.join(targetDir, '$metadata.json');
  let themes = [themeName];

  await fs.mkdir(targetDir, { recursive: true });

  try {
    // Update with existing themes
    const $themes = await fs.readFile($themesPath, 'utf-8');
    const themeObjects = (JSON.parse($themes) as ThemeObject[]) || [];
    themes = R.pipe(
      R.filter((obj: ThemeObject) => R.toLower(obj.group || '') === 'theme'),
      R.map(R.prop('name')),
      R.append(themeName),
      R.uniq,
    )(themeObjects) as string[];
  } catch (error) {}

  console.log(`Themes: ${chalk.blue(themes.join(', '))}`);

  // Create metadata and themes json for Token Studio and build script
  const $theme = generateThemesJson(['light', 'dark', 'contrast'], themes);
  const $metadata = generateMetadataJson(['light', 'dark', 'contrast'], themes);

  await fs.writeFile($themesPath, stringify($theme));
  await fs.writeFile($metadataPath, stringify($metadata));

  // Copy default files
  await fs.cp(DEFAULT_FILES_PATH, targetDir, {
    recursive: true,
  });

  // Create themes file
  await fs.mkdir(path.join(targetDir, 'themes'), { recursive: true });
  const themeTemplate = await fs.readFile(path.join(TEMPLATE_FILES_PATH, `themes/theme.json`), 'utf-8');
  await fs.writeFile(path.join(targetDir, `themes/${themeName}.json`), themeTemplate.replaceAll('<theme>', themeName));

  const files: File[] = [
    generateColorModeFile('light', themeName, tokens.colors.light[themeName], targetDir),
    generateColorModeFile('light', 'global', tokens.colors.light.global, targetDir),
    generateColorModeFile('dark', themeName, tokens.colors.dark[themeName], targetDir),
    generateColorModeFile('dark', 'global', tokens.colors.dark.global, targetDir),
    generateColorModeFile('contrast', themeName, tokens.colors.contrast[themeName], targetDir),
    generateColorModeFile('contrast', 'global', tokens.colors.contrast.global, targetDir),
    generateTypographyFile('primary', themeName, tokens.typography.primary, targetDir),
    generateTypographyFile('secondary', themeName, tokens.typography.primary, targetDir),
  ];

  for (const file of files) {
    const dirPath = path.resolve(file.path);
    const filePath = path.resolve(file.filePath);
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, file.data, { encoding: 'utf-8' });
  }

  console.log(
    `Finished creating Designsystem design tokens in ${chalk.green(writeDir)} for theme ${chalk.blue(themeName)}`,
  );
};
