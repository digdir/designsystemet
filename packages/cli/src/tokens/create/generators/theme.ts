import * as R from 'ramda';
import { baseColorNames } from '../../../colors/colorMetadata.js';
import type { ColorNumber } from '../../../colors/types.js';

import type { Colors, Token, TokenSet } from '../../types.js';

export const generateTheme = (colors: Colors, themeName: string, borderRadius: number) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);
  const customColors = [...mainColorNames, 'neutral', ...supportColorNames, ...baseColorNames];

  const themeColorTokens = Object.fromEntries(
    customColors.map(
      (colorName) =>
        [
          colorName,
          R.map(
            (x) => ({
              $type: x.$type,
              $value: typeof x.$value === 'string' ? x.$value.replace('<color>', colorName) : x.$value,
            }),
            themeColorTemplate,
          ),
        ] as const,
    ),
  );

  const { color: themeBaseFileColor, ...remainingThemeFile } = themeBase;
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

const themeBase: TokenSet = {
  color: {},
  'font-family': {
    $type: 'fontFamilies',
    $value: '{<theme>.font-family}',
  },
  'font-weight': {
    medium: {
      $type: 'fontWeights',
      $value: '{<theme>.font-weight.medium}',
    },
    semibold: {
      $type: 'fontWeights',
      $value: '{<theme>.font-weight.semibold}',
    },
    regular: {
      $type: 'fontWeights',
      $value: '{<theme>.font-weight.regular}',
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
};

const themeColorTemplate: Record<ColorNumber, Token> = {
  '1': {
    $type: 'color',
    $value: '{<theme>.<color>.1}',
  },
  '2': {
    $type: 'color',
    $value: '{<theme>.<color>.2}',
  },
  '3': {
    $type: 'color',
    $value: '{<theme>.<color>.3}',
  },
  '4': {
    $type: 'color',
    $value: '{<theme>.<color>.4}',
  },
  '5': {
    $type: 'color',
    $value: '{<theme>.<color>.5}',
  },
  '6': {
    $type: 'color',
    $value: '{<theme>.<color>.6}',
  },
  '7': {
    $type: 'color',
    $value: '{<theme>.<color>.7}',
  },
  '8': {
    $type: 'color',
    $value: '{<theme>.<color>.8}',
  },
  '9': {
    $type: 'color',
    $value: '{<theme>.<color>.9}',
  },
  '10': {
    $type: 'color',
    $value: '{<theme>.<color>.10}',
  },
  '11': {
    $type: 'color',
    $value: '{<theme>.<color>.11}',
  },
  '12': {
    $type: 'color',
    $value: '{<theme>.<color>.12}',
  },
  '13': {
    $type: 'color',
    $value: '{<theme>.<color>.13}',
  },
  '14': {
    $type: 'color',
    $value: '{<theme>.<color>.14}',
  },
  '15': {
    $type: 'color',
    $value: '{<theme>.<color>.15}',
  },
  '16': {
    $type: 'color',
    $value: '{<theme>.<color>.16}',
  },
};
