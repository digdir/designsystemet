import fs from 'node:fs/promises';
import path from 'node:path';
import * as R from 'ramda';
import type { ColorMode } from '../../colors/types.js';
import type { Collection, File, Tokens, TokensSet, TypographyModes } from '../types.js';
import { generateMetadataJson } from './generate$metadata.js';
import { generateThemesJson } from './generate$themes.js';

const DIRNAME: string = import.meta.dirname || __dirname;
const DEFAULT_FILES_PATH = path.join(DIRNAME, '../../init/template/default-files/design-tokens/');

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

export const writeTokens = async (writeDir: string, tokens: Tokens) => {
  const targetDir = path.resolve(process.cwd(), String(writeDir));
  await fs.mkdir(targetDir, { recursive: true });

  // Generate metadata and themes json for Token Studio and build script
  console.log('Generating metadata and themes files');
  const $theme = generateThemesJson(['light', 'dark', 'contrast'], ['theme']);
  const $metadata = generateMetadataJson(['light', 'dark', 'contrast'], ['theme']);

  await fs.writeFile(path.join(targetDir, '$themes.json'), JSON.stringify($theme, null, 2));
  await fs.writeFile(path.join(targetDir, '$metadata.json'), JSON.stringify($metadata, null, 2));

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
