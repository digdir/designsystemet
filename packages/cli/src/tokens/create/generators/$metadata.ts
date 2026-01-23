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
      ...sizesAndGlobal.flatMap((size) =>
        themes.flatMap((theme) =>
          fontNamesPerTheme[theme].map((font) => `primitives/modes/size/${size}/${theme}/${font}`),
        ),
      ),
      ...themes.flatMap((theme) => fontNamesPerTheme[theme].map((font) => `primitives/fonts/${theme}/${font}`)),
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
