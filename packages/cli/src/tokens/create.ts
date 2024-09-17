import { baseColors, generateScaleForColor } from '../colors/index.js';
import type { ColorInfo, ColorMode } from '../colors/types.js';
import type { Colors, Tokens, Tokens1ary, TokensSet, Typography } from './types.js';

export type CreateTokensOptions = {
  colors: Colors;
  typography: Typography;
  themeName: string;
};

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

const generateThemeTokens = (themeName: string, theme: ColorMode, colors: Colors): TokensSet => {
  const accentColors = generateScaleForColor(colors.accent, theme);
  const neutralColors = generateScaleForColor(colors.neutral, theme);
  const brand1Colors = generateScaleForColor(colors.brand1, theme);
  const brand2Colors = generateScaleForColor(colors.brand2, theme);
  const brand3Colors = generateScaleForColor(colors.brand3, theme);

  return {
    [themeName]: {
      accent: createColorTokens(accentColors),
      neutral: createColorTokens(neutralColors),
      brand1: createColorTokens(brand1Colors),
      brand2: createColorTokens(brand2Colors),
      brand3: createColorTokens(brand3Colors),
    },
  };
};

const generateGlobalTokens = (theme: ColorMode) => {
  const blueScale = generateScaleForColor(baseColors.blue, theme);
  const greenScale = generateScaleForColor(baseColors.green, theme);
  const orangeScale = generateScaleForColor(baseColors.orange, theme);
  const purpleScale = generateScaleForColor(baseColors.purple, theme);
  const redScale = generateScaleForColor(baseColors.red, theme);
  const yellowScale = generateScaleForColor(baseColors.yellow, theme);

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

export const createTokens = (opts: CreateTokensOptions) => {
  const { colors, typography, themeName: name } = opts;

  const tokens: Tokens = {
    colors: {
      light: {
        [name]: generateThemeTokens(name, 'light', colors),
        global: generateGlobalTokens('light'),
      },
      dark: { [name]: generateThemeTokens(name, 'dark', colors), global: generateGlobalTokens('dark') },
      contrast: {
        [name]: generateThemeTokens(name, 'contrast', colors),
        global: generateGlobalTokens('contrast'),
      },
    },
    typography: {
      primary: generateTypographyTokens(name, typography),
    },
  };

  return tokens;
};
