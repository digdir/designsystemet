import type { ColorNamesByCategory, OutputFile, TokenSetDimensions, TokenSets } from '../types.js';
import { generate$Designsystemet } from './generators/$designsystemet.js';
import { generate$Metadata } from './generators/$metadata.js';
import { generate$Themes } from './generators/$themes.js';

export const stringify = (data: unknown) => JSON.stringify(data, null, 2);

type CreateTokenFilesOptions = {
  tokenSetDimensions: TokenSetDimensions;
  colors: ColorNamesByCategory;
  themeNames: string[];
};

/**
 * Creates system token files (`$themes.json`, `$metadata.json`, `$designsystemet.jsonc`) based on the provided token set dimensions and theme names.
 *
 * `$themes.json` and `$metadata.json` are essential for Token Studio and Style Dictionary to correctly interpret and manage the design tokens.
 */
export const createSystemTokenFiles = async (options: CreateTokenFilesOptions) => {
  const { colors, themeNames, tokenSetDimensions } = options;

  const files: OutputFile[] = [];
  const $themesPath = '$themes.json';
  const $metadataPath = '$metadata.json';
  const $designsystemetPath = '$designsystemet.jsonc';

  const $themes = await generate$Themes(tokenSetDimensions, themeNames, colors);
  const $metadata = generate$Metadata(tokenSetDimensions, themeNames, colors);
  const $designsystemet = generate$Designsystemet();

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
