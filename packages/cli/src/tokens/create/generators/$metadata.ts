import type { Colors, TokenSetDimensionsForAllThemes } from '../../types.js';

type Metadata = {
  tokenSetOrder: string[];
};

export function generate$Metadata(
  dimensions: TokenSetDimensionsForAllThemes,
  themes: string[],
  colors: Colors,
): Metadata {
  const { colorSchemes, sizeModes, fontNamesPerTheme } = dimensions;
  const sizesAndGlobal = ['global', ...sizeModes];
  return {
    tokenSetOrder: [
      'primitives/globals',
      ...sizesAndGlobal.map((size) => `primitives/modes/size/${size}`),
      ...themes.flatMap((theme) =>
        fontNamesPerTheme[theme].flatMap((font) =>
          sizesAndGlobal.map((size) => `primitives/modes/fonts/${font}/size/${size}/${theme}`),
        ),
      ),
      ...themes.flatMap((theme) => fontNamesPerTheme[theme].map((font) => `primitives/fonts/${font}/${theme}`)),
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
