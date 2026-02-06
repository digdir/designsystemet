import * as R from 'ramda';
import { baseColorNames } from '../../../../colors/colorMetadata.js';
import { type ColorNumber, semanticColorMap } from '../../../../colors/types.js';
import type { Colors, Token, TokenSet } from '../../../types.js';

export const generateTheme = (colors: Colors, themeName: string, borderRadius: number) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);
  const customColors = [...mainColorNames, 'neutral', ...supportColorNames, ...baseColorNames];

  const themeColorTokens = Object.fromEntries(
    customColors.map((colorName) => [colorName, generateColorScaleTokens(colorName, themeName)]),
  );

  const { color: themeBaseFileColor, ...remainingThemeFile } = generateBase(themeName);
  const themeFile = {
    color: {
      ...themeColorTokens,
      ...themeBaseFileColor,
      link: {
        visited: {
          $type: 'color',
          $value: `{${themeName}.link.visited}`,
        },
      },
      focus: {
        'inner-color': {
          $type: 'color',
          $value: `{${themeName}.focus.inner}`,
        },
        'outer-color': {
          $type: 'color',
          $value: `{${themeName}.focus.outer}`,
        },
      },
    },
    ...remainingThemeFile,
  };

  const baseBorderRadius = R.lensPath(['border-radius', 'base', '$value']);
  const updatedThemeFile = R.set(baseBorderRadius, String(borderRadius), themeFile);
  const token = JSON.parse(
    JSON.stringify(
      updatedThemeFile,
      (key, value) => {
        if (key === '$value') {
          return (value as string).replace('<theme>', themeName);
        }

        return value;
      },
      2,
    ),
  ) as TokenSet;

  return token;
};

const generateBase = (themeName: string): TokenSet => ({
  color: {},
  'font-family': {
    $type: 'fontFamilies',
    $value: `{${themeName}.font-family}`,
  },
  'font-weight': {
    medium: {
      $type: 'fontWeights',
      $value: `{${themeName}.font-weight.medium}`,
    },
    semibold: {
      $type: 'fontWeights',
      $value: `{${themeName}.font-weight.semibold}`,
    },
    regular: {
      $type: 'fontWeights',
      $value: `{${themeName}.font-weight.regular}`,
    },
  },
  'border-radius': {
    '1': {
      $type: 'dimension',
      $value: 'min({border-radius.base}*0.5,{border-radius.scale})',
    },
    '2': {
      $type: 'dimension',
      $value: 'min({border-radius.base},{border-radius.scale}*2)',
    },
    '3': {
      $type: 'dimension',
      $value: 'min({border-radius.base}*2,{border-radius.scale}*5)',
    },
    '4': {
      $type: 'dimension',
      $value: 'min({border-radius.base}*3,{border-radius.scale}*7)',
    },
    '5': {
      $type: 'dimension',
      $value: '{border-radius.base}',
    },
    '6': {
      $type: 'dimension',
      $value: '9999',
    },
    base: {
      $type: 'dimension',
      $value: '4',
    },
    scale: {
      $type: 'dimension',
      $value: '4',
    },
  },
});

const generateColorScaleTokens = (colorName: string, themeName: string): Record<ColorNumber, Token> => {
  const colorScale = {} as Record<ColorNumber, Token>;

  for (const [_, colorNumber] of R.toPairs(semanticColorMap)) {
    colorScale[colorNumber] = {
      $type: 'color',
      $value: `{${themeName}.${colorName}.${colorNumber}}`,
    };
  }

  return colorScale;
};
