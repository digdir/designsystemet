import * as R from 'ramda';
import { baseColorNames } from '../../../colors/colorMetadata.js';
import themeBase from '../../template/design-tokens/themes/theme.base.template.json' with { type: 'json' };
import themeColorTemplate from '../../template/design-tokens/themes/theme.template.json' with { type: 'json' };
import type { Colors, TokenSet, Typography } from '../../types.js';

function generateFonts(theme: string, fonts: string[]): TokenSet {
  return Object.fromEntries(
    fonts.map((font) => [
      font,
      {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{${theme}.fonts.${font}.font-family}`,
        },
        'font-weight': {
          medium: {
            $type: 'fontWeights',
            $value: `{${theme}.fonts.${font}.font-weight.medium}`,
          },
          semibold: {
            $type: 'fontWeights',
            $value: `{${theme}.fonts.${font}.font-weight.semibold}`,
          },
          regular: {
            $type: 'fontWeights',
            $value: `{${theme}.fonts.${font}.font-weight.regular}`,
          },
        },
        'font-size': {
          '1': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.1}`,
          },
          '2': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.2}`,
          },
          '3': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.3}`,
          },
          '4': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.4}`,
          },
          '5': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.5}`,
          },
          '6': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.6}`,
          },
          '7': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.7}`,
          },
          '8': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.8}`,
          },
          '9': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.9}`,
          },
          '10': {
            $type: 'fontSizes',
            $value: `{${theme}.fonts.${font}.font-size.10}`,
          },
        },
        'line-height': {
          sm: {
            $type: 'lineHeights',
            $value: `{${theme}.fonts.${font}.line-height.sm}`,
          },
          md: {
            $type: 'lineHeights',
            $value: `{${theme}.fonts.${font}.line-height.md}`,
          },
          lg: {
            $type: 'lineHeights',
            $value: `{${theme}.fonts.${font}.line-height.lg}`,
          },
        },
        'letter-spacing': {
          '1': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.1}`,
          },
          '2': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.2}`,
          },
          '3': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.3}`,
          },
          '4': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.4}`,
          },
          '5': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.5}`,
          },
          '6': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.6}`,
          },
          '7': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.7}`,
          },
          '8': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.8}`,
          },
          '9': {
            $type: 'letterSpacing',
            $value: `{${theme}.fonts.${font}.letter-spacing.9}`,
          },
        },
      },
    ]),
  );
}

function generateBackwardCompatibilityFontTokens(defaultFont: string) {
  const lineHeights = ['sm', 'md', 'lg'];
  const fontWeights = ['medium', 'semibold', 'regular'];
  const fontSizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const letterSpacings = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  return {
    'line-height': Object.fromEntries(
      lineHeights.map(
        (lineHeight) =>
          [
            lineHeight,
            {
              $type: 'lineHeights',
              $value: `{fonts.${defaultFont}.line-height.${lineHeight}}`,
            },
          ] as const,
      ),
    ),
    'font-family': {
      $type: 'fontFamilies',
      $value: `{fonts.${defaultFont}.font-family}`,
    },
    'font-weight': Object.fromEntries(
      fontWeights.map(
        (weight) =>
          [
            weight,
            {
              $type: 'fontWeights',
              $value: `{fonts.${defaultFont}.font-weight.${weight}}`,
            },
          ] as const,
      ),
    ),
    'font-size': Object.fromEntries(
      fontSizes.map(
        (size) =>
          [
            size,
            {
              $type: 'fontSizes',
              $value: `{fonts.${defaultFont}.font-size.${size}}`,
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
              $value: `{fonts.${defaultFont}.letter-spacing.${letterSpacing}}`,
            },
          ] as const,
      ),
    ),
  };
}

export const generateTheme = (
  colors: Colors,
  themeName: string,
  fontNames: string[],
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
    fonts: generateFonts(themeName, fontNames),
    // Generate a backward-compatibility layer for the old "font-size", "line-height" etc tokens
    ...generateBackwardCompatibilityFontTokens(defaultFont),
    // The mapping from typography to fonts can't be in the typography tokens themself due
    // to how Figma generates typography styles. Therefore we have this extra layer.
    'typography-mapping': generateThemeTypography(typography),
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

function generateThemeTypography(typography: Typography) {
  // TODO handle fallback font somewhere else?
  const defaultFont = Object.keys(typography.fonts ?? []).at(0) ?? 'primary';
  const headingFont = typography.components?.heading?.font ?? defaultFont;
  const bodyFont = typography.components?.body?.font ?? defaultFont;
  return {
    heading: {
      '2xl': {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${headingFont}.font-size.10}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${headingFont}.letter-spacing.1}`,
        },
      },
      xl: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${headingFont}.font-size.9}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${headingFont}.letter-spacing.1}`,
        },
      },
      lg: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${headingFont}.font-size.8}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${headingFont}.letter-spacing.2}`,
        },
      },
      md: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${headingFont}.font-size.7}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${headingFont}.letter-spacing.3}`,
        },
      },
      sm: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${headingFont}.font-size.6}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${headingFont}.letter-spacing.5}`,
        },
      },
      xs: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${headingFont}.font-size.5}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${headingFont}.letter-spacing.6}`,
        },
      },
      '2xs': {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${headingFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${headingFont}.font-weight.medium}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${headingFont}.line-height.sm}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${headingFont}.font-size.4}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${headingFont}.letter-spacing.6}`,
        },
      },
    },
    body: {
      xl: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${bodyFont}.font-size.6}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${bodyFont}.letter-spacing.8}`,
        },
      },
      lg: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${bodyFont}.font-size.5}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${bodyFont}.letter-spacing.8}`,
        },
      },
      md: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${bodyFont}.font-size.4}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${bodyFont}.letter-spacing.8}`,
        },
      },
      sm: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${bodyFont}.font-size.3}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${bodyFont}.letter-spacing.7}`,
        },
      },
      xs: {
        'font-family': {
          $type: 'fontFamilies',
          $value: `{fonts.${bodyFont}.font-family}`,
        },
        'font-weight': {
          $type: 'fontWeights',
          $value: `{fonts.${bodyFont}.font-weight.regular}`,
        },
        'line-height': {
          $type: 'lineHeights',
          $value: `{fonts.${bodyFont}.line-height.md}`,
        },
        'font-size': {
          $type: 'fontSizes',
          $value: `{fonts.${bodyFont}.font-size.2}`,
        },
        'letter-spacing': {
          $type: 'letterSpacing',
          $value: `{fonts.${bodyFont}.letter-spacing.6}`,
        },
      },
      short: {
        xl: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.6}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        lg: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.5}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        md: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.4}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        sm: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.3}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.7}`,
          },
        },
        xs: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.sm}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.2}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.6}`,
          },
        },
      },
      long: {
        xl: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.6}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        lg: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.5}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        md: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.4}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.8}`,
          },
        },
        sm: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.3}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.7}`,
          },
        },
        xs: {
          'font-family': {
            $type: 'fontFamilies',
            $value: `{fonts.${bodyFont}.font-family}`,
          },
          'font-weight': {
            $type: 'fontWeights',
            $value: `{fonts.${bodyFont}.font-weight.regular}`,
          },
          'line-height': {
            $type: 'lineHeights',
            $value: `{fonts.${bodyFont}.line-height.lg}`,
          },
          'font-size': {
            $type: 'fontSizes',
            $value: `{fonts.${bodyFont}.font-size.2}`,
          },
          'letter-spacing': {
            $type: 'letterSpacing',
            $value: `{fonts.${bodyFont}.letter-spacing.6}`,
          },
        },
      },
    },
  };
}
