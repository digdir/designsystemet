import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import pc from 'picocolors';
import * as R from 'ramda';
import fs from '../../utils/filesystem.js';
import type { OutputFile, SizeModes, Theme, TokenSets } from '../types.js';
import { generate$Designsystemet } from './generators/$designsystemet.js';
import { generate$Metadata } from './generators/$metadata.js';
import { generate$Themes } from './generators/$themes.js';

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

type WriteTokensOptions = {
  outDir: string;
  theme: Theme;
  tokenSets: TokenSets;
};

export const writeTokens = async (options: WriteTokensOptions) => {
  const {
    outDir,
    tokenSets,
    theme: { name: themeName, colors },
  } = options;

  const $themesPath = '$themes.json';
  const $metadataPath = '$metadata.json';
  const $designsystemetPath = '$designsystemet.jsonc';
  let themeObjects: ThemeObject[] = [];
  const sizeModes: SizeModes[] = ['small', 'medium', 'large'];

  await fs.mkdir(outDir);

  try {
    // Fetch existing themes
    const $themes = await fs.readFile(path.join(outDir, $themesPath));
    if ($themes) {
      themeObjects = JSON.parse($themes) as ThemeObject[];
    }
  } catch (_error) {}

  const concatThemeNames = R.pipe(
    R.filter((obj: ThemeObject) => R.toLower(obj.group || '') === 'theme'),
    R.map(R.prop('name')),
    // New theme is added to the end of the list so we keep the same order from config and Token Studio
    R.append(themeName),
    R.uniq,
  );

  const themes = concatThemeNames(themeObjects);

  console.log(`\nThemes: ${pc.blue(themes.join(', '))}`);

  // Create metadata and themes json for Token Studio and build script
  const $themes = await generate$Themes(['dark', 'light'], themes, colors, sizeModes);
  const $metadata = generate$Metadata(['dark', 'light'], themes, colors, sizeModes);
  const $designsystemet = generate$Designsystemet();

  const files: OutputFile[] = [];

  files.push({ destination: $themesPath, output: stringify($themes) });
  files.push({ destination: $metadataPath, output: stringify($metadata) });
  files.push({ destination: $designsystemetPath, output: stringify($designsystemet) });

  for (const [set, tokens] of tokenSets) {
    const filePath = `${set}.json`;
    files.push({ destination: filePath, output: stringify(tokens) });
  }

  return files;
};
