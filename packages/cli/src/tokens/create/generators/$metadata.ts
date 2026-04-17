import type { TokenSetDimensionsForAllThemes } from '../../types.js';

type Metadata = {
  tokenSetOrder: string[];
};

/*
 * Generates the `$metadata.json` file content based on the provided token set dimensions and theme names.
 *
 * The `$metadata.json` defines the order of token sets for Token Studio and Style Dictionary.
 */
export function generate$Metadata(dimensions: TokenSetDimensionsForAllThemes, themes: string[]): Metadata {
  const { colorSchemes, sizeModes, fontNamesPerTheme, colorsPerTheme } = dimensions;
  const sizesAndGlobal = ['global', ...sizeModes];
  const colors = colorsPerTheme[themes[0]]; // Get colors from the first theme as a representative for generating color groups, since they are expected to be the same across themes
  return {
    tokenSetOrder: [
      'primitives/globals',
      ...sizesAndGlobal.map((size) => `primitives/modes/size/${size}`),
      ...sizesAndGlobal.flatMap((size) =>
        themes.flatMap(
          (theme) =>
            fontNamesPerTheme[theme]?.map((font) => `primitives/modes/size/${size}/${theme}/font-${font}`) ?? [],
        ),
      ),
      ...themes.flatMap((theme) => fontNamesPerTheme[theme]?.map((font) => `primitives/fonts/${theme}/${font}`) ?? []),
      ...colorSchemes.flatMap((scheme) => [
        ...themes.map((theme) => `primitives/modes/color-scheme/${scheme}/${theme}`),
      ]),
      ...themes.map((theme) => `themes/${theme}`),
      'semantic/color',
      ...Object.entries(colors.main).map(([color]) => `semantic/modes/main-color/${color}`),
      ...Object.entries(colors.support).map(([color]) => `semantic/modes/support-color/${color}`),
      'semantic/style',
    ],
  };
}
