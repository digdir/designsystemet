import { generate$Designsystemet } from './create/generators/$designsystemet.ts';
import { generate$Metadata } from './create/generators/$metadata.ts';
import { generate$Themes } from './create/generators/$themes.ts';
import { generateColorScheme } from './create/generators/primitives/color-scheme.ts';
import { generateGlobals } from './create/generators/primitives/globals.ts';
import { generateSize, generateSizeGlobal } from './create/generators/primitives/size.ts';
import { generateFontSizes, generateTypography } from './create/generators/primitives/typography.ts';
import { generateColorTokens } from './create/generators/semantic/color.ts';
import { generateSemanticStyle } from './create/generators/semantic/style.ts';
import { generateTheme } from './create/generators/themes/theme.ts';
import type { OutputFile, Theme, TokenSet, TokenSetDimensions, TokenSets } from './types.ts';
import { addSeverityColors, toColorNames } from './utils.ts';

export type { ThemeObject_ } from './create/generators/$themes.ts';

export const tokenSetDimensions: TokenSetDimensions = {
  colorSchemes: ['dark', 'light'],
  sizeModes: ['small', 'medium', 'large'],
};

export const createTokens = async (theme: Theme) => {
  const { typography, name, borderRadius, overrides } = theme;
  const { colorSchemes, sizeModes } = tokenSetDimensions;

  const colors = addSeverityColors(theme.colors);
  const colorNames = toColorNames(colors);
  const colorTokens = Object.entries(generateColorTokens(colorNames, name));

  const tokenSets: TokenSets = new Map([
    ['primitives/globals', generateGlobals()],
    ...sizeModes.map((size): [string, TokenSet] => [`primitives/modes/size/${size}`, generateSize(size)]),
    ['primitives/modes/size/global', generateSizeGlobal()],
    ...sizeModes.map((size): [string, TokenSet] => [
      `primitives/modes/typography/size/${size}`,
      generateFontSizes(size),
    ]),
    [`primitives/modes/typography/primary/${name}`, generateTypography(name, typography)],
    [`primitives/modes/typography/secondary/${name}`, generateTypography(name, typography)],
    ...colorSchemes.flatMap((scheme): [string, TokenSet][] => [
      [`primitives/modes/color-scheme/${scheme}/${name}`, generateColorScheme(name, scheme, colors, overrides)],
    ]),
    [`themes/${name}`, generateTheme(colorNames, name, borderRadius)],
    ...colorTokens.map(([colorName, colorSetTokens]): [string, TokenSet] => [
      `semantic/color/${colorName}`,
      colorSetTokens,
    ]),
    [`semantic/style`, generateSemanticStyle(colorNames)],
  ]);

  return { tokenSets };
};

const stringify = (data: unknown) => JSON.stringify(data, null, 2);

type CreateTokenFilesOptions = {
  tokenSetDimensions: TokenSetDimensions;
  colorNames: string[];
  themeNames: string[];
};

export const createSystemTokens = async (options: CreateTokenFilesOptions) => {
  const { colorNames, themeNames, tokenSetDimensions } = options;

  const $themes = await generate$Themes(tokenSetDimensions, themeNames, colorNames);
  const $metadata = generate$Metadata(tokenSetDimensions, themeNames, colorNames);
  const $designsystemet = generate$Designsystemet();

  return {
    $themes,
    $metadata,
    $designsystemet,
  };
};

/**
 * Creates system token files (`$themes.json`, `$metadata.json`, `$designsystemet.jsonc`) based on the provided token set dimensions and theme names.
 *
 * `$themes.json` and `$metadata.json` are essential for Token Studio and Style Dictionary to correctly interpret and manage the design tokens.
 */
export const systemTokenToFiles = async (options: CreateTokenFilesOptions) => {
  const { $themes, $metadata, $designsystemet } = await createSystemTokens(options);

  const files: OutputFile[] = [];
  const $themesPath = '$themes.json';
  const $metadataPath = '$metadata.json';
  const $designsystemetPath = '$designsystemet.jsonc';

  files.push({ destination: $themesPath, output: stringify($themes) });
  files.push({ destination: $metadataPath, output: stringify($metadata) });
  files.push({ destination: $designsystemetPath, output: stringify($designsystemet) });

  return files;
};

/**
 * Pass tokenSets created from `createTokens` to this function to convert them into an array of OutputFile objects, which can then be written to disk or used as needed.
 * @param tokenSets
 * @returns
 */
export const tokenSetsToFiles = (tokenSets: TokenSets): OutputFile[] => {
  const files: OutputFile[] = [];

  for (const [set, tokens] of tokenSets) {
    const filePath = `${set}.json`;
    files.push({ destination: filePath, output: stringify(tokens) });
  }
  return files;
};
