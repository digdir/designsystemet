import { type ColorNames, semanticColorNames } from '../../../../colors/types.js';
import type { Token, TokenSet } from '../../../types.js';

export const generateColorTokens = (colorNames: string[], _themeName: string): Record<string, TokenSet> => {
  const colorTokens = {} as Record<string, TokenSet>;

  for (const colorName of colorNames) {
    const customColorTokens = {
      color: generateSemanticColorScaleTokens(colorName),
    };
    colorTokens[colorName] = customColorTokens;
  }

  return colorTokens;
};

const generateSemanticColorScaleTokens = (colorName: string): Record<ColorNames, Token> => {
  const colorScale = {} as Record<ColorNames, Token>;

  for (const semanticColorName of semanticColorNames) {
    colorScale[semanticColorName] = {
      $type: 'color',
      $value: `{color.${colorName}.${semanticColorName}}`,
    };
  }

  return colorScale;
};
