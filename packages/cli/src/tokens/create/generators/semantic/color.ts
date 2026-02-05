import { baseColorNames } from '../../../../colors/colorMetadata.js';
import type { ColorMetadataByName, ColorNumber, SemanticColorNumberMap } from '../../../../colors/types.js';
import type { Colors, Token, TokenSet } from '../../../types.js';

export const generateSemanticColors = (colors: Colors, _themeName: string) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);

  const customColors = [...mainColorNames, 'neutral', ...supportColorNames];

  const allColors = [...customColors, ...baseColorNames];

  const semanticColorTokens = allColors.map((colorName) => [colorName, generateColorScale(colorName)]);

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

const generateColorScale = (colorName: string): Record<keyof ColorMetadataByName, Token> => {
  const colorMap: SemanticColorNumberMap = {
    'background-default': 1,
    'background-tinted': 2,
    'surface-default': 3,
    'surface-tinted': 4,
    'surface-hover': 5,
    'surface-active': 6,
    'border-subtle': 7,
    'border-default': 8,
    'border-strong': 9,
    'text-subtle': 10,
    'text-default': 11,
    'base-default': 12,
    'base-hover': 13,
    'base-active': 14,
    'base-contrast-subtle': 15,
    'base-contrast-default': 16,
  };

  const colorScale = {} as Record<keyof ColorMetadataByName, Token>;

  for (const [colorSemantic, colorNumber] of Object.entries(colorMap) as [keyof ColorMetadataByName, ColorNumber][]) {
    colorScale[colorSemantic] = {
      $type: 'color',
      $value: `{color.${colorName}.${colorNumber}}`,
    };
  }

  return colorScale;
};
