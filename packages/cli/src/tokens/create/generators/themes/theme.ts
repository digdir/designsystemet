import * as R from 'ramda';
import { baseColorNames } from '../../../../colors/colorMetadata.js';
import { type ColorNumber, semanticColorMap } from '../../../../colors/types.js';
import type { Colors, Token, TokenSet, Typography } from '../../../types.js';

export const generateTheme = (colors: Colors, themeName: string, borderRadius: number, typography: Typography) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);
  const customColors = [...mainColorNames, 'neutral', ...supportColorNames, ...baseColorNames];

  // TODO handle default font name somewhere else
  const defaultFont = Object.keys(typography.fonts ?? {}).at(0) ?? 'primary';

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
    // Generate a backward-compatibility layer for the old "font-size", "line-height" etc tokens
    ...generateBackwardCompatibilityFontTokens(themeName, defaultFont),
    // The mapping from typography to fonts can't be in the typography tokens themself due
    // to how Figma generates typography styles. Therefore we have this extra layer.
    'typography-mapping': generateThemeTypography(themeName, typography),
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

function generateBackwardCompatibilityFontTokens(themeName: string, defaultFont: string) {
  const lineHeights = ['sm', 'md', 'lg'];
  const fontWeights = ['medium', 'semibold', 'regular'];
  const fontSizes = {
    // mapping from old to new font scale
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '8',
    '8': '9',
    '9': '11',
    '10': '13',
  };
  const letterSpacings = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return {
    'line-height': Object.fromEntries(
      lineHeights.map(
        (lineHeight) =>
          [
            lineHeight,
            {
              $type: 'lineHeights',
              $value: `{${themeName}.fonts.${defaultFont}.line-height.${lineHeight}}`,
            },
          ] as const,
      ),
    ),
    'font-family': {
      $type: 'fontFamilies',
      $value: `{${themeName}.fonts.${defaultFont}.font-family}`,
    },
    'font-weight': Object.fromEntries(
      fontWeights.map(
        (weight) =>
          [
            weight,
            {
              $type: 'fontWeights',
              $value: `{${themeName}.fonts.${defaultFont}.font-weight.${weight}}`,
            },
          ] as const,
      ),
    ),
    'font-size': Object.fromEntries(
      Object.entries(fontSizes).map(
        ([oldSize, newSize]) =>
          [
            oldSize,
            {
              $type: 'fontSizes',
              $value: `{${themeName}.fonts.${defaultFont}.font-size.${newSize}}`,
            },
          ] as const,
      ),
    ),
    'letter-spacing': Object.fromEntries(
      letterSpacings.map(
        (letterSpacing) =>
          [
            letterSpacing,
            {
              $type: 'letterSpacing',
              $value: `{${themeName}.fonts.${defaultFont}.letter-spacing.${letterSpacing}}`,
            },
          ] as const,
      ),
    ),
  };
}

function generateThemeTypography(themeName: string, typography: Typography) {
  // TODO handle fallback font somewhere else?
  const defaultFont = Object.keys(typography.fonts ?? []).at(0) ?? 'primary';
  const headingFont = typography.components?.heading?.font ?? defaultFont;
  const bodyFont = typography.components?.body?.font ?? defaultFont;
  return {
    heading: {
      '2xl': {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${headingFont}.font-size.13}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${headingFont}.letter-spacing.1}`,
        },
      },
      xl: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${headingFont}.font-size.11}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${headingFont}.letter-spacing.1}`,
        },
      },
      lg: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${headingFont}.font-size.9}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${headingFont}.letter-spacing.2}`,
        },
      },
      md: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${headingFont}.font-size.8}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${headingFont}.letter-spacing.3}`,
        },
      },
      sm: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${headingFont}.font-size.6}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${headingFont}.letter-spacing.5}`,
        },
      },
      xs: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${headingFont}.font-size.5}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${headingFont}.letter-spacing.6}`,
        },
      },
      '2xs': {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${headingFont}.font-size.4}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${headingFont}.letter-spacing.6}`,
        },
      },
    },
    body: {
      xl: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${bodyFont}.font-size.6}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
        },
      },
      lg: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${bodyFont}.font-size.5}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
        },
      },
      md: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${bodyFont}.font-size.4}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
        },
      },
      sm: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${bodyFont}.font-size.3}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.7}`,
        },
      },
      xs: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{${themeName}.fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{${themeName}.fonts.${bodyFont}.font-size.2}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.6}`,
        },
      },
      short: {
        xl: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.6}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        lg: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.5}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        md: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.4}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        sm: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.3}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.7}`,
          },
        },
        xs: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.2}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.6}`,
          },
        },
      },
      long: {
        xl: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.6}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        lg: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.5}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        md: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.4}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        sm: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.3}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.7}`,
          },
        },
        xs: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{${themeName}.fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{${themeName}.fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{${themeName}.fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{${themeName}.fonts.${bodyFont}.font-size.2}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{${themeName}.fonts.${bodyFont}.letter-spacing.6}`,
          },
        },
      },
    },
  };
}
