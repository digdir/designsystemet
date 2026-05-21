import { type ColorNames, semanticColorNames } from '../../../../colors/types.js';
import type { Colors, Token, TokenSet } from '../../../types.js';

export const generateColorModes = (colors: Colors, _themeName: string): Record<string, TokenSet> => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);
  const _allColorNames = [...mainColorNames, ...supportColorNames, 'neutral'];

  const colorTokens = {} as Record<string, TokenSet>;

  for (const colorName of _allColorNames) {
    const customColorTokens = {
      color: generateColorScaleTokens(colorName),
    };
    colorTokens[colorName] = customColorTokens;
  }

  return colorTokens;
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
