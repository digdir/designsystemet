import type { OutputFile, TokenSetDimensionsForAllThemes, TokenSets } from '../types.js';
import { generate$Designsystemet } from './generators/$designsystemet.js';
import { generate$Metadata } from './generators/$metadata.js';
import { generate$Themes } from './generators/$themes.js';

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

type CreateTokenFilesOptions = {
  tokenSetDimensions: TokenSetDimensionsForAllThemes;
  themeNames: string[];
};

export const createTokenFiles = async (options: CreateTokenFilesOptions) => {
  const { themeNames, tokenSetDimensions } = options;

  const $themesPath = '$themes.json';
  const $metadataPath = '$metadata.json';
  const $designsystemetPath = '$designsystemet.jsonc';

  // Create metadata and themes json for Token Studio and build script
  const $themes = await generate$Themes(tokenSetDimensions, themeNames);
  const $metadata = generate$Metadata(tokenSetDimensions, themeNames);
  const $designsystemet = generate$Designsystemet();

  const files: OutputFile[] = [];

  files.push({ destination: $themesPath, output: stringify($themes) });
  files.push({ destination: $metadataPath, output: stringify($metadata) });
  files.push({ destination: $designsystemetPath, output: stringify($designsystemet) });

  return files;
};

export const tokenSetsToFiles = (tokenSets: TokenSets): OutputFile[] => {
  const files: OutputFile[] = [];

  for (const [set, tokens] of tokenSets) {
    const filePath = `${set}.json`;
    files.push({ destination: filePath, output: stringify(tokens) });
  }
  return files;
};
