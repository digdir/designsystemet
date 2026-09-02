import type { SizeModes, TokenSet, Typography } from '../../../types.ts';

export const generateTypography = (themeName: string, typography: Typography): TokenSet => ({
  [themeName]: {
    'font-family': {
      $type: 'fontFamilies',
      $value: typography.fontFamily,
    },
    'font-weight': Object.fromEntries(
      Object.entries(typography.fontWeight).map(([name, value]) => [
        name,
        {
          $type: 'fontWeights',
          $value: value,
        },
      ]),
    ),
  },
});

export const generateFontSizes = (size: SizeModes, typography: Typography): TokenSet => ({
  'line-height': Object.fromEntries(
    Object.entries(typography.lineHeight).map(([name, value]) => [
      name,
      {
        $type: 'lineHeights',
        $value: value,
      },
    ]),
  ),
  'font-size': fontSizes[size],
  'letter-spacing': Object.fromEntries(
    Object.entries(typography.letterSpacing).map(([name, value]) => [
      name,
      {
        $type: 'letterSpacing',
        $value: value,
      },
    ]),
  ),
});

const fontSizes = {
  large: {
    '1': {
      $type: 'fontSizes',
      $value: '13',
    },
    '2': {
      $type: 'fontSizes',
      $value: '16',
    },
    '3': {
      $type: 'fontSizes',
      $value: '18',
    },
    '4': {
      $type: 'fontSizes',
      $value: '21',
    },
    '5': {
      $type: 'fontSizes',
      $value: '24',
    },
    '6': {
      $type: 'fontSizes',
      $value: '30',
    },
    '7': {
      $type: 'fontSizes',
      $value: '36',
    },
    '8': {
      $type: 'fontSizes',
      $value: '48',
    },
    '9': {
      $type: 'fontSizes',
      $value: '60',
    },
    '10': {
      $type: 'fontSizes',
      $value: '72',
    },
  },
  medium: {
    '1': {
      $type: 'fontSizes',
      $value: '12',
    },
    '2': {
      $type: 'fontSizes',
      $value: '14',
    },
    '3': {
      $type: 'fontSizes',
      $value: '16',
    },
    '4': {
      $type: 'fontSizes',
      $value: '18',
    },
    '5': {
      $type: 'fontSizes',
      $value: '21',
    },
    '6': {
      $type: 'fontSizes',
      $value: '24',
    },
    '7': {
      $type: 'fontSizes',
      $value: '30',
    },
    '8': {
      $type: 'fontSizes',
      $value: '36',
    },
    '9': {
      $type: 'fontSizes',
      $value: '48',
    },
    '10': {
      $type: 'fontSizes',
      $value: '60',
    },
  },
  small: {
    '1': {
      $type: 'fontSizes',
      $value: '11',
    },
    '2': {
      $type: 'fontSizes',
      $value: '13',
    },
    '3': {
      $type: 'fontSizes',
      $value: '14',
    },
    '4': {
      $type: 'fontSizes',
      $value: '16',
    },
    '5': {
      $type: 'fontSizes',
      $value: '18',
    },
    '6': {
      $type: 'fontSizes',
      $value: '21',
    },
    '7': {
      $type: 'fontSizes',
      $value: '24',
    },
    '8': {
      $type: 'fontSizes',
      $value: '30',
    },
    '9': {
      $type: 'fontSizes',
      $value: '36',
    },
    '10': {
      $type: 'fontSizes',
      $value: '48',
    },
  },
};
