import fs from 'node:fs/promises';
import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import * as R from 'ramda';
import type { ColorMode } from '../colors/types.js';
import type { Collection, File, Tokens, TokensSet, TypographyModes } from './types.js';
import { generateMetadataJson } from './write/generate$metadata.js';
import { generateThemesJson } from './write/generate$themes.js';

const DIRNAME: string = import.meta.dirname || __dirname;
const DEFAULT_FILES_PATH = path.join(DIRNAME, '../init/template/default-files/design-tokens/');

const generateColorModeFile = (folder: ColorMode, name: Collection, tokens: TokensSet, outPath: string): File => {
  const path = `${outPath}/primitives/modes/colors/${folder}`;
  return {
    data: JSON.stringify(tokens, null, 2),
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
    data: JSON.stringify(tokens, null, 2),
    path,
    filePath: `${path}/${name}.json`,
  };
};

export const writeTokens = async (writeDir: string, tokens: Tokens, themeName: string) => {
  const targetDir = path.resolve(process.cwd(), String(writeDir));
  const $themesPath = path.join(targetDir, '$themes.json');
  const $metadataPath = path.join(targetDir, '$metadata.json');
  let themes = [themeName];

  await fs.mkdir(targetDir, { recursive: true });

  try {
    // Update with existing themes
    const $themes = await fs.readFile($themesPath, 'utf-8');
    const themeobj = JSON.parse($themes) as ThemeObject[];
    themes = R.pipe(
      R.filter((obj: ThemeObject) => R.toLower(obj.group || '') === 'theme'),
      R.map(R.prop('name')),
      R.append(themeName),
      R.uniq,
    )(themeobj || []) as string[];
  } catch (error) {}

  console.log(`Writing tokens to ${targetDir} with themes: ${themes}`);

  // Generate metadata and themes json for Token Studio and build script
  console.log('Generating metadata and themes files');
  const $theme = generateThemesJson(['light', 'dark', 'contrast'], themes);
  const $metadata = generateMetadataJson(['light', 'dark', 'contrast'], themes);

  await fs.writeFile($themesPath, JSON.stringify($theme, null, 2));
  await fs.writeFile($metadataPath, JSON.stringify($metadata, null, 2));

  console.log(`Copying default files to ${targetDir}`);
  await fs.cp(DEFAULT_FILES_PATH, targetDir, {
    recursive: true,
  });

  const files: File[] = [
    generateColorModeFile('light', 'theme', tokens.colors.light.theme, targetDir),
    generateColorModeFile('light', 'global', tokens.colors.light.global, targetDir),
    generateColorModeFile('dark', 'theme', tokens.colors.dark.theme, targetDir),
    generateColorModeFile('dark', 'global', tokens.colors.dark.global, targetDir),
    generateColorModeFile('contrast', 'theme', tokens.colors.contrast.theme, targetDir),
    generateColorModeFile('contrast', 'global', tokens.colors.contrast.global, targetDir),
    generateTypographyFile('primary', 'theme', tokens.typography.primary, targetDir),
    generateTypographyFile('secondary', 'theme', tokens.typography.primary, targetDir),
  ];

  for (const file of files) {
    const dirPath = path.resolve(file.path);
    const filePath = path.resolve(file.filePath);
    console.log(`Writing file ${filePath}`);
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, file.data, { encoding: 'utf-8' });
  }
};
