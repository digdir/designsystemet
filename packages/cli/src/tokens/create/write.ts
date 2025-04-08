import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import { FileSystem } from '../../utils.js';
import type { Theme, TokenSets } from '../types.js';
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
  let themes = [themeName];

  const fs = new FileSystem(dry);
  await fs.mkdir(targetDir);

  try {
    // Update with existing themes
    const $themes = await fs.readFile($themesPath);
    const themeObjects = (JSON.parse($themes) as ThemeObject[]) || [];
    const concatThemeNames = R.pipe(
      R.filter((obj: ThemeObject) => R.toLower(obj.group || '') === 'theme'),
      R.map(R.prop('name')),
      R.concat(themes),
      R.uniq,
    );

    themes = concatThemeNames(themeObjects);
  } catch (error) {}

  console.log(`Themes: ${chalk.blue(themes.join(', '))}`);

  // Create metadata and themes json for Token Studio and build script
  const $themes = await generate$Themes(['dark', 'light'], themes, colors);
  const $metadata = generate$Metadata(tokenSets);

  await fs.writeFile($themesPath, stringify($themes));
  await fs.writeFile($metadataPath, stringify($metadata));

  for (const [set, tokens] of tokenSets) {
    // Remove last part of the path to get the directory
    const fileDir = path.join(targetDir, path.dirname(set));
    await fs.mkdir(fileDir);

    const filePath = path.join(targetDir, `${set}.json`);
    await fs.writeFile(filePath, stringify(tokens));
  }

  console.log(
    `Finished creating Designsystem design tokens in ${chalk.green(outDir)} for theme ${chalk.blue(themeName)}`,
  );
};
