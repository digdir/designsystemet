import type { TokenSetDimensions } from '../../types.ts';

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
  colorNames: string[],
): Metadata {
  const { colorSchemes, sizeModes, typographies } = tokenSetDimensions;
  return {
    tokenSetOrder: [
      'primitives/globals',
      ...sizeModes.map((size) => `primitives/modes/size/${size}`),
      'primitives/modes/size/global',
      ...sizeModes.map((size) => `primitives/modes/typography/size/${size}`),
      ...typographies.flatMap((typography) =>
        themeNames.map((theme) => `primitives/modes/typography/${typography}/${theme}`),
      ),
      ...colorSchemes.flatMap((scheme) => [
        ...themeNames.map((theme) => `primitives/modes/color-scheme/${scheme}/${theme}`),
      ]),
      ...themeNames.map((theme) => `themes/${theme}`),
      ...colorNames.map((color) => `semantic/color/${color}`),
      'semantic/style',
    ],
  };
}
