import * as R from 'ramda';
import type { TypographyFontSchema, TypographySizeSchema } from '../../../../config.js';
import type { Token, TokenSet } from '../../../types.js';

const defaults = {
  small: {
    base: 16,
    ratio: 1.14234,
  },
  medium: {
    base: 18,
    ratio: 1.143136,
  },
  large: {
    base: 21,
    ratio: 1.143136,
  },
};

export function generateFontSizeGlobal(themeName: string, fontName: string) {
  return {
    [themeName]: {
      fonts: {
        [fontName]: {
          'font-size': {
            '1': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} / pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 3), 0)`,
            },
            '2': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} / pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 2), 0)`,
            },
            '3': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} / pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 1), 0)`,
            },
            '4': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 0), 0)`,
            },
            '5': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 1), 0)`,
            },
            '6': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 2), 0)`,
            },
            '7': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 3), 0)`,
            },
            '8': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 4), 0)`,
            },
            '9': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 5), 0)`,
            },
            '10': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 6), 0)`,
            },
            '11': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 7), 0)`,
            },
            '12': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 8), 0)`,
            },
            '13': {
              $type: 'fontSizes',
              $value: `roundTo({${themeName}.fonts.${fontName}.font-scale._base} * pow({${themeName}.fonts.${fontName}.font-scale._ratio}, 9), 0)`,
            },
          },
        },
      },
    },
  };
}

export function generateFontSizeMode(
  size: 'small' | 'medium' | 'large',
  themeName: string,
  fontName: string,
  config?: TypographySizeSchema,
) {
  const sizeConfig = config?.[size];
  return {
    [themeName]: {
      fonts: {
        [fontName]: {
          'font-scale': {
            _base: {
              $type: 'number',
              $value: `${sizeConfig?.base ?? defaults[size].base}`,
            } satisfies Token,
            _ratio: {
              $type: 'number',
              $value: `${sizeConfig?.ratio ?? defaults[size].ratio}`,
            } satisfies Token,
          },
          ...(sizeConfig?.overrides && {
            'font-size': R.map(
              (fontSizeInPx) =>
                ({
                  $type: 'fontSizes',
                  $value: `${fontSizeInPx}px`,
                }) satisfies Token,
              sizeConfig.overrides,
            ),
          }),
        },
      },
    },
  };
}

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
