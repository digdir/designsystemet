import * as R from 'ramda';
import { baseColors, generateColorScale } from '../colors/index.js';
import type { Color, ColorScheme } from '../colors/types.js';
import type { Colors, Theme, Tokens, TokensSet, Typography } from './types.js';

export const cliOptions = {
  outDir: 'out-dir',
  clean: 'clean',
  theme: {
    colors: {
      main: 'main-colors',
      support: 'support-colors',
      neutral: 'neutral-color',
    },
    typography: {
      fontFamily: 'font-family',
    },
    borderRadius: 'border-radius',
  },
} as const;

const createColorTokens = (colorArray: Color[]): TokensSet => {
  const obj: TokensSet = {};
  const $type = 'color';
  for (const index in colorArray) {
    obj[Number(index) + 1] = { $type, $value: colorArray[index].hex };
  }
  return obj;
};

const generateTypographyTokens = (themeName: string, { fontFamily }: Typography): TokensSet => {
  return {
    [themeName]: {
      'font-family': {
        $type: 'fontFamilies',
        $value: fontFamily ?? 'Inter',
      },
      'font-weight': {
        medium: {
          $type: 'fontWeights',
          $value: 'Medium',
        },
        semibold: {
          $type: 'fontWeights',
          $value: 'SemiBold',
        },
        regular: {
          $type: 'fontWeights',
          $value: 'Regular',
        },
      },
    },
  };
};

const generateThemeTokens = (themeName: string, colorScheme: ColorScheme, colors: Colors): TokensSet => {
  const main = R.map((color) => createColorTokens(generateColorScale(color, colorScheme)), colors.main);
  const support = R.map((color) => createColorTokens(generateColorScale(color, colorScheme)), colors.support);
  const neutral = createColorTokens(generateColorScale(colors.neutral, colorScheme));

  return {
    [themeName]: {
      ...main,
      ...support,
      neutral,
    },
  };
};

const generateGlobalTokens = (colorScheme: ColorScheme) => {
  const blueScale = generateColorScale(baseColors.blue, colorScheme);
  const greenScale = generateColorScale(baseColors.green, colorScheme);
  const orangeScale = generateColorScale(baseColors.orange, colorScheme);
  const purpleScale = generateColorScale(baseColors.purple, colorScheme);
  const redScale = generateColorScale(baseColors.red, colorScheme);

  return {
    global: {
      blue: createColorTokens(blueScale),
      green: createColorTokens(greenScale),
      orange: createColorTokens(orangeScale),
      purple: createColorTokens(purpleScale),
      red: createColorTokens(redScale),
    },
  };
};

export const createTokens = (opts: Theme) => {
  const { colors, typography, name } = opts;

  const tokens: Tokens = {
    primitives: {
      'colors-scheme': {
        light: {
          [name]: generateThemeTokens(name, 'light', colors),
          global: generateGlobalTokens('light'),
        },
        dark: { [name]: generateThemeTokens(name, 'dark', colors), global: generateGlobalTokens('dark') },
        // contrast: {
        //   [name]: generateThemeTokens(name, 'contrast', colors),
        //   global: generateGlobalTokens('contrast'),
        // },
      },
      typography: {
        primary: generateTypographyTokens(name, typography),
      },
    },
  };

  return tokens;
};
