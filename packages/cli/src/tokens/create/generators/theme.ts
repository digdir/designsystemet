import * as R from 'ramda';
import { baseColorNames } from '../../../colors/colorMetadata.js';
import themeBase from '../../template/design-tokens/themes/theme.base.template.json' with { type: 'json' };
import themeColorTemplate from '../../template/design-tokens/themes/theme.template.json' with { type: 'json' };
import type { Colors, TokenSet, Typography } from '../../types.js';

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

export const generateTheme = (
  colors: Colors,
  themeName: string,
  _fontNames: string[],
  borderRadius: number,
  typography: Typography,
) => {
  const mainColorNames = Object.keys(colors.main);
  const supportColorNames = Object.keys(colors.support);
  const customColors = [...mainColorNames, 'neutral', ...supportColorNames, ...baseColorNames];
  // TODO handle default font name somewhere else
  const defaultFont = Object.keys(typography.fonts ?? {}).at(0) ?? 'primary';

  const themeColorTokens = Object.fromEntries(
    customColors.map(
      (colorName) =>
        [
          colorName,
          R.map((x) => ({ ...x, $value: x.$value.replace('<color>', colorName) }), themeColorTemplate),
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
        if (key === '$value' && typeof value === 'string') {
          return value.replace('<theme>', themeName);
        }

        return value;
      },
      2,
    ),
  ) as TokenSet;

  return token;
};

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
