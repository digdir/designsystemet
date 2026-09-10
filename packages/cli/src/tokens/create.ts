import { addSeverityColors } from '../colors/scale.ts';
import { generate$Designsystemet } from './create/generators/$designsystemet.ts';
import { generate$Metadata } from './create/generators/$metadata.ts';
import { generate$Themes } from './create/generators/$themes.ts';
import { generateColorScheme } from './create/generators/primitives/color-scheme.ts';
import { generateGlobals } from './create/generators/primitives/globals.ts';
import { generateSize, generateSizeGlobal } from './create/generators/primitives/size.ts';
import { generateTypography, generateTypographyMode } from './create/generators/primitives/typography.ts';
import { generateColorTokens } from './create/generators/semantic/color.ts';
import { generateSemanticStyle } from './create/generators/semantic/style.ts';
import { generateTheme } from './create/generators/themes/theme.ts';
import type { OutputFile, SizeModes, Theme, TokenSet, TokenSetDimensions, TokenSets } from './types.ts';
import { toColorNames } from './utils.ts';

export {
  FIGMA_COLLECTION,
  type FigmaCollections,
  type FigmaMode,
  mergeTokenSets,
  type SelectedTokenSet,
  type ThemeObjectInput,
  toFigmaCollections,
  UNGROUPED,
} from './create/figma-collections.ts';
export type { ThemeObject_ } from './create/generators/$themes.ts';

export const getTokenSetDimensions = (theme: Pick<Theme, 'size' | 'typography'>): TokenSetDimensions => ({
  colorSchemes: ['dark', 'light'],
  // The size modes are defined by the steps in the size configuration.
  sizeModes: Object.keys(theme.size.steps) as SizeModes[],
  // The typography sets are defined by the keys in the typography configuration.
  typographies: Object.keys(theme.typography),
});

export const createTokens = async (theme: Theme, tokenSetDimensions: TokenSetDimensions) => {
  const { typography, name, borderRadius, overrides, size, shadow, opacity, 'border-width': borderWidth } = theme;
  const { colorSchemes, sizeModes } = tokenSetDimensions;

  const colors = addSeverityColors(theme.colors);
  const colorNames = toColorNames(colors);
  const colorTokens = Object.entries(generateColorTokens(colorNames, name));

  // The first typography set provides the values shared across sets:
  // size-mode line-heights/letter-spacings, semantic components and theme font-weight references.
  const primaryTypography = Object.values(typography)[0];
  if (!primaryTypography) {
    throw new Error(`Theme "${name}" must define at least one typography set`);
  }

  /** Keys here must match the keys in `selectedTokenSets` in `generate$Themes` */
  const tokenSets: TokenSets = new Map([
    ['primitives/globals', generateGlobals(shadow, borderWidth, opacity)],
    ...sizeModes.map((sizeMode): [string, TokenSet] => [
      `primitives/modes/size/${sizeMode}`,
      generateSize(sizeMode, size),
    ]),
    ['primitives/modes/size/global', generateSizeGlobal(size)],
    ...sizeModes.map((sizeMode): [string, TokenSet] => [
      `primitives/modes/typography/size/${sizeMode}`,
      generateTypographyMode(sizeMode, primaryTypography, size),
    ]),
    ...Object.entries(typography).map(([setName, set]): [string, TokenSet] => [
      `primitives/modes/typography/${setName}/${name}`,
      generateTypography(name, set),
    ]),
    ...colorSchemes.flatMap((scheme): [string, TokenSet][] => [
      [`primitives/modes/color-scheme/${scheme}/${name}`, generateColorScheme(name, scheme, colors, overrides)],
    ]),
    [`themes/${name}`, generateTheme(colorNames, name, borderRadius, primaryTypography)],
    ...colorTokens.map(([colorName, colorSetTokens]): [string, TokenSet] => [
      `semantic/color/${colorName}`,
      colorSetTokens,
    ]),
    [
      `semantic/style`,
      generateSemanticStyle(colorNames, borderWidth, borderRadius, primaryTypography, shadow, size, opacity),
    ],
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
