import { dsfs } from '../../utils/filesystem.js';
import type { OutputFile, SizeModes, Theme, TokenSets } from '../types.js';
import { generate$Designsystemet } from './generators/$designsystemet.js';
import { generate$Metadata } from './generators/$metadata.js';
import { generate$Themes } from './generators/$themes.js';

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

type CreateTokenFilesOptions = {
  outDir: string;
  theme: Theme;
  tokenSets: TokenSets;
  themeNames: string[];
};

export const createTokenFiles = async (options: CreateTokenFilesOptions) => {
  const {
    outDir,
    tokenSets,
    theme: { colors },
    themeNames,
  } = options;

  const $themesPath = '$themes.json';
  const $metadataPath = '$metadata.json';
  const $designsystemetPath = '$designsystemet.jsonc';
  // let themeObjects: ThemeObject[] = [];
  const sizeModes: SizeModes[] = ['small', 'medium', 'large'];

  await dsfs.mkdir(outDir);

  // Create metadata and themes json for Token Studio and build script
  const $themes = await generate$Themes(['dark', 'light'], themeNames, colors, sizeModes);
  const $metadata = generate$Metadata(['dark', 'light'], themeNames, colors, sizeModes);
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
