import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import { mkdir, readFile, writeFile } from '../utils.js';
import type { Theme, TokensSet } from './types.js';
import { generateMetadataJson } from './write/generate$metadata.js';
import { generateThemesJson } from './write/generate$themes.js';

const DIRNAME: string = import.meta.dirname || __dirname;

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

type WriteTokensOptions = {
  outDir: string;
  theme: Theme;
  /** Dry run, no files will be written */
  dry?: boolean;
  tokenSets: Map<string, TokensSet>;
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

  await mkdir(targetDir, dry);

  try {
    // Update with existing themes
    const $themes = await readFile($themesPath);
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
  const $theme = await generateThemesJson(['dark', 'light'], themes, colors);
  const $metadata = generateMetadataJson(tokenSets);

  await writeFile($themesPath, stringify($theme), dry);
  await writeFile($metadataPath, stringify($metadata), dry);

  for (const [set, tokens] of tokenSets) {
    // Remove last part of the path to get the directory
    const fileDir = path.join(targetDir, R.init(R.split('/', set)).join('/'));
    await mkdir(fileDir, dry);

    const filePath = path.join(targetDir, `${set}.json`);
    await writeFile(filePath, stringify(tokens), dry);
  }

  console.log(
    `Finished creating Designsystem design tokens in ${chalk.green(outDir)} for theme ${chalk.blue(themeName)}`,
  );
};
