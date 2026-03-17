import { type ColorNames, semanticColorNames } from '../../../../colors/types.js';
import type { Colors, Token, TokenSet } from '../../../types.js';

type SemanticModes = {
  'main-color': Record<string, TokenSet>;
  'support-color': Record<string, TokenSet>;
};

export const generateColorModes = (colors: Colors, _themeName: string) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);

  const modes: SemanticModes = {
    'main-color': {},
    'support-color': {},
  };

  const categories = [
    ['main-color', mainColorNames],
    ['support-color', supportColorNames],
  ] as const;

  // Create main-color and support-color modes for the custom colors
  for (const [colorCategory, colorNames] of categories) {
    for (const colorName of colorNames) {
      const category = colorCategory.replace('-color', '');
      const customColorTokens = {
        color: {
          [category]: generateColorScaleTokens(colorName),
        },
      };
      modes[colorCategory][colorName] = customColorTokens;
    }
  }

  return modes;
};

const generateColorScaleTokens = (colorName: string): Record<ColorNames, Token> => {
  const colorScale = {} as Record<ColorNames, Token>;

  for (const colorSemantic of semanticColorNames) {
    colorScale[colorSemantic] = {
      $type: 'color',
      $value: `{color.${colorName}.${colorSemantic}}`,
    };
  }

  return colorScale;
};
