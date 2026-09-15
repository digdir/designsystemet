import { type SemanticColorNames, semanticColorNames } from '../../../../colors/index.ts';
import type { Token, TokenSet } from '../../../types.ts';

export const generateColorTokens = (colorNames: string[], _themeName: string): Record<string, TokenSet> => {
  const colorTokens = {} as Record<string, TokenSet>;

  for (const colorName of colorNames) {
    const customColorTokens = generateSemanticColorScaleTokens(colorName);
    colorTokens[colorName] = customColorTokens;
  }

  return colorTokens;
};

const generateSemanticColorScaleTokens = (colorName: string): Record<SemanticColorNames, Token> => {
  const colorScale = {} as Record<SemanticColorNames, Token>;

  for (const semanticColorName of semanticColorNames) {
    colorScale[semanticColorName] = {
      $type: 'color',
      $value: `{color.${colorName}.${semanticColorName}}`,
    };
  }

  return colorScale;
};
