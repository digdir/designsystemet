import * as R from 'ramda';
import { baseColors, generateColorScale } from '../colors/index.js';
import type { ColorInfo, ColorScheme } from '../colors/types.js';
import type { Colors, Theme, Tokens, Tokens1ary, TokensSet, Typography } from './types.js';

export const cliOptions = {
  outDir: 'out-dir',
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

const createColorTokens = (colorArray: ColorInfo[]): Tokens1ary => {
  const obj: Tokens1ary = {};
  const $type = 'color';
  for (let i = 0; i < colorArray.length; i++) {
    if (i === 13 && colorArray.length >= 14) {
      obj['contrast-1'] = {
        $type,
        $value: colorArray[i].hex,
      };
    } else if (i === 14 && colorArray.length >= 15) {
      obj['contrast-2'] = {
        $type,
        $value: colorArray[i].hex,
      };
    } else {
      obj[i + 1] = { $type, $value: colorArray[i].hex };
    }
  }
  return obj;
};

const generateTypographyTokens = (themeName: string, { fontFamily }: Typography): TokensSet => {
  return {
    [themeName]: {
      main: {
        $type: 'fontFamilies',
        $value: fontFamily ?? 'Inter',
      },
      bold: {
        $type: 'fontWeights',
        $value: 'Medium',
      },
      'extra-bold': {
        $type: 'fontWeights',
        $value: 'Semi bold',
      },
      regular: {
        $type: 'fontWeights',
        $value: 'Regular',
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
  const yellowScale = generateColorScale(baseColors.yellow, colorScheme);

  return {
    global: {
      blue: createColorTokens(blueScale),
      green: createColorTokens(greenScale),
      orange: createColorTokens(orangeScale),
      purple: createColorTokens(purpleScale),
      red: createColorTokens(redScale),
      yellow: createColorTokens(yellowScale),
    },
  };
};

export const createTokens = (opts: Theme) => {
  const { colors, typography, name } = opts;

  const tokens: Tokens = {
    colors: {
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
  };

  return tokens;
};
