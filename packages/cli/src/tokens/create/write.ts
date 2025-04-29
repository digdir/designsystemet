import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import { mkdir, readFile, writeFile } from '../../utils.js';
import type { Theme, TokenSets } from '../types.js';
import { generate$Designsystemet } from './generators/$designsystemet.js';
import { generate$Metadata } from './generators/$metadata.js';
import { generate$Themes } from './generators/$themes.js';

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

type WriteTokensOptions = {
  outDir: string;
  theme: Theme;
  /** Dry run, no files will be written */
  dry?: boolean;
  tokenSets: TokenSets;
};

export const writeTokens = async (options: WriteTokensOptions) => {
  const {
    outDir,
    tokenSets,
    theme: { name: themeName, colors },
    dry,
  } = options;
  const targetDir = path.resolve(process.cwd(), String(outDir));
  const $themesPath = path.join(targetDir, '$themes.json');
  const $metadataPath = path.join(targetDir, '$metadata.json');
  const $designsystemetPath = path.join(targetDir, '$designsystemet.json');
  let themeObjects: ThemeObject[] = [];

  await mkdir(targetDir, dry);

  try {
    // Fetch existing themes
    const $themes = await readFile($themesPath);
    if ($themes) {
      themeObjects = JSON.parse($themes) as ThemeObject[];
    }
  } catch (error) {}

  const concatThemeNames = R.pipe(
    R.filter((obj: ThemeObject) => R.toLower(obj.group || '') === 'theme'),
    R.map(R.prop('name')),
    // New theme is added to the end of the list so we keep the same order from config and Token Studio
    R.append(themeName),
    R.uniq,
  );

  const themes = concatThemeNames(themeObjects);

  console.log(`\nThemes: ${chalk.blue(themes.join(', '))}`);

  // Create metadata and themes json for Token Studio and build script
  const $themes = await generate$Themes(['dark', 'light'], themes, colors);
  const $metadata = generate$Metadata(['dark', 'light'], themes, colors);
  const $designsystemet = generate$Designsystemet();

  await writeFile($themesPath, stringify($themes), dry);
  await writeFile($metadataPath, stringify($metadata), dry);
  await writeFile($designsystemetPath, stringify($designsystemet), dry);

  for (const [set, tokens] of tokenSets) {
    // Remove last part of the path to get the directory
    const fileDir = path.join(targetDir, path.dirname(set));
    await mkdir(fileDir, dry);

    const filePath = path.join(targetDir, `${set}.json`);
    await writeFile(filePath, stringify(tokens), dry);
  }

  console.log(
    `Finished creating Designsystem design tokens in ${chalk.green(outDir)} for theme ${chalk.blue(themeName)}`,
  );
};
