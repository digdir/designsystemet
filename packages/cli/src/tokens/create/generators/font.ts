import type { TypographyFontSchema } from '../../../config.js';

import type { TokenSet } from '../../types.js';

export const generateFont = (themeName: string, fontName: string, fontDefinition: TypographyFontSchema): TokenSet => {
  return {
    [themeName]: {
      fonts: {
        [fontName]: {
          'font-family': {
            $type: 'fontFamilies',
            $value: fontDefinition.fontFamily,
          },
          'font-weight': {
            medium: {
              $type: 'fontWeights',
              $value: fontDefinition.fontWeight.medium,
            },
            semibold: {
              $type: 'fontWeights',
              $value: fontDefinition.fontWeight.semibold,
            },
            regular: {
              $type: 'fontWeights',
              $value: fontDefinition.fontWeight.regular,
            },
          },
          'line-height': {
            sm: {
              $type: 'lineHeights',
              $value: '130%',
            },
            md: {
              $type: 'lineHeights',
              $value: '150%',
            },
            lg: {
              $type: 'lineHeights',
              $value: '170%',
            },
          },
          'letter-spacing': {
            '1': {
              $type: 'letterSpacing',
              $value: '-1%',
            },
            '2': {
              $type: 'letterSpacing',
              $value: '-0.5%',
            },
            '3': {
              $type: 'letterSpacing',
              $value: '-0.25%',
            },
            '4': {
              $type: 'letterSpacing',
              $value: '-0.15%',
            },
            '5': {
              $type: 'letterSpacing',
              $value: '0%',
            },
            '6': {
              $type: 'letterSpacing',
              $value: '0.15%',
            },
            '7': {
              $type: 'letterSpacing',
              $value: '0.25%',
            },
            '8': {
              $type: 'letterSpacing',
              $value: '0.5%',
            },
            '9': {
              $type: 'letterSpacing',
              $value: '1.5%',
            },
          },
        },
      },
    },
  } satisfies TokenSet;
};
