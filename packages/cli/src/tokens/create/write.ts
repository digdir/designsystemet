import path from 'node:path';
import type { ThemeObject } from '@tokens-studio/types';
import pc from 'picocolors';
import * as R from 'ramda';
import { mkdir, readFile, writeFile } from '../../utils.js';
import type { Theme, TokenSetDimensions, TokenSetDimensionsForAllThemes, TokenSets } from '../types.js';
import { generate$Designsystemet } from './generators/$designsystemet.js';
import { generate$Metadata } from './generators/$metadata.js';
import { generate$Themes } from './generators/$themes.js';

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

type WriteTokensOptions = {
  outDir: string;
  theme: Theme;
  tokenSetDimensions: TokenSetDimensions;
  /** Dry run, no files will be written */
  dry?: boolean;
  tokenSets: TokenSets;
};

/*
=== HACKY WORKAROUND ===

When tokens create is run with multiple themes, it will be run like this:
 1. Theme: first-theme
   a. Create token sets for first-theme
   b. Create $metadata and $themes for first-theme
 2. Theme: second-theme
   a. Create token sets for second-theme
   b. Create $metadata and $themes for first-theme and second-theme,
      overwriting what was done in step 1b.
 ...

Since font names can vary across themes, we have to store them and ensure the generators
for $metadata and $themes have all the necessary information. Else they will overwrite the
correctly generated token set references for fonts with the font names for the last theme.
*/
let tokenSetDimensionsPerTheme: TokenSetDimensionsForAllThemes;

export const writeTokens = async (options: WriteTokensOptions) => {
  const {
    outDir,
    tokenSets,
    theme: { name: themeName, colors },
    tokenSetDimensions: tokenSetDimensionsForCurrentTheme,
    dry,
  } = options;
  tokenSetDimensionsPerTheme = tokenSetDimensionsPerTheme ?? {
    colorSchemes: tokenSetDimensionsForCurrentTheme.colorSchemes,
    sizeModes: tokenSetDimensionsForCurrentTheme.sizeModes,
    fontNamesPerTheme: {}, // initialise with empty object, will be populated next
  };
  tokenSetDimensionsPerTheme.fontNamesPerTheme[themeName] = tokenSetDimensionsForCurrentTheme.fontNames;
  const targetDir = path.resolve(process.cwd(), String(outDir));
  const $themesPath = path.join(targetDir, '$themes.json');
  const $metadataPath = path.join(targetDir, '$metadata.json');
  const $designsystemetPath = path.join(targetDir, '$designsystemet.jsonc');
  let themeObjects: ThemeObject[] = [];

  await mkdir(targetDir, dry);

  try {
    // Fetch existing themes
    const $themes = await readFile($themesPath);
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
  const $themes = await generate$Themes(tokenSetDimensionsPerTheme, themes, colors);
  const $metadata = generate$Metadata(tokenSetDimensionsPerTheme, themes, colors);
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

  console.log(`Finished creating Designsystem design tokens in ${pc.green(outDir)} for theme ${pc.blue(themeName)}`);
};
