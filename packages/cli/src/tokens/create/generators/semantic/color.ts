import * as R from 'ramda';
import { baseColorNames } from '../../../../colors/colorMetadata.js';
import { type ColorNames, semanticColorMap } from '../../../../colors/types.js';
import type { Colors, Token, TokenSet } from '../../../types.js';

export const generateSemanticColors = (colors: Colors, _themeName: string) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);

  const customColors = [...mainColorNames, 'neutral', ...supportColorNames];

  const allColors = [...customColors, ...baseColorNames];

  const semanticColorTokens = allColors.map((colorName) => [colorName, generateColorScaleTokens(colorName)]);

  return {
    ...baseColorTemplate,
    color: {
      ...Object.fromEntries(semanticColorTokens),
      ...baseColorTemplate.color,
    },
  };
};

const baseColorTemplate: TokenSet = {
  color: {
    focus: {
      inner: {
        $type: 'color',
        $value: '{color.focus.inner-color}',
      },
      outer: {
        $type: 'color',
        $value: '{color.focus.outer-color}',
      },
    },
  },
  link: {
    color: {
      visited: {
        $type: 'color',
        $value: '{color.link.visited}',
      },
    },
  },
};

const generateColorScaleTokens = (colorName: string): Record<ColorNames, Token> => {
  const colorScale = {} as Record<ColorNames, Token>;

  for (const [colorSemantic, colorNumber] of R.toPairs(semanticColorMap)) {
    colorScale[colorSemantic] = {
      $type: 'color',
      $value: `{color.${colorName}.${colorNumber}}`,
    };
  }

  return colorScale;
};
