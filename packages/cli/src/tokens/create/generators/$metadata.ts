import type { ColorNamesByCategory, TokenSetDimensions } from '../../types.js';

type Metadata = {
  tokenSetOrder: string[];
};

/**
 * Generates metadata for the given token set dimensions, theme names, and colors.
 *
 * This is used to order tokens in Token Studio
 */
export function generate$Metadata(
  tokenSetDimensions: TokenSetDimensions,
  themeNames: string[],
  colors: ColorNamesByCategory,
): Metadata {
  const { colorSchemes, sizeModes } = tokenSetDimensions;
  return {
    tokenSetOrder: [
      'primitives/globals',
      ...sizeModes.map((size) => `primitives/modes/size/${size}`),
      'primitives/modes/size/global',
      ...sizeModes.map((size) => `primitives/modes/typography/size/${size}`),
      ...themeNames.map((theme) => `primitives/modes/typography/primary/${theme}`),
      ...themeNames.map((theme) => `primitives/modes/typography/secondary/${theme}`),
      ...colorSchemes.flatMap((scheme) => [
        ...themeNames.map((theme) => `primitives/modes/color-scheme/${scheme}/${theme}`),
      ]),
      ...themeNames.map((theme) => `themes/${theme}`),
      'semantic/color',
      ...colors.main.map((color) => `semantic/modes/main-color/${color}`),
      ...colors.support.map((color) => `semantic/modes/support-color/${color}`),
      'semantic/style',
    ],
  };
}
