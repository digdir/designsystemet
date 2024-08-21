import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { BackgroundColor, Color, Theme } from '@adobe/leonardo-contrast-colors';
import { Hsluv } from 'hsluv';

import type { BaseColors, ColorInfo, ColorMode, ColorNumber, ContrastMode, ThemeColors, ThemeInfo } from './types';
import { getContrastFromHex, getContrastFromLightness, getLightnessFromHex } from './utils';

export const baseColors: Record<BaseColors, CssColor> = {
  blue: '#0A71C0',
  green: '#078D19',
  orange: '#CA5C21',
  purple: '#663299',
  red: '#C01B1B',
  yellow: '#EABF28',
};

type Colors = Record<ThemeColors, CssColor>;

export type ColorError = 'none' | 'decorative' | 'interaction';

type GlobalGenType = {
  themeMode?: ColorMode | 'all';
  contrastMode?: ContrastMode;
};

type ThemeGenType = {
  colors: Colors;
  contrastMode?: ContrastMode;
};

/**
 * Generates a Leonardo theme color that is used to create a Leonardo Theme
 *
 * @param color CssColor
 * @param mode Light, Dark or Contrastmode
 * @param contrastMode Contrast mode
 * @returns
 */
const generateThemeColor = (color: CssColor, mode: ColorMode, contrastMode: 'aa' | 'aaa' = 'aa') => {
  const leoBackgroundColor = new BackgroundColor({
    name: 'backgroundColor',
    colorKeys: ['#ffffff'],
    ratios: [1],
  });
  let colorLightness = getLightnessFromHex(color);
  if (mode === 'dark' || mode === 'contrast') {
    color = getBaseColor(color);
    colorLightness = colorLightness <= 30 ? 70 : 100 - colorLightness;
  }

  const multiplier = colorLightness <= 30 ? -8 : 8;
  const baseDefaultContrast = getContrastFromLightness(colorLightness, color, leoBackgroundColor.colorKeys[0]);
  const baseHoverContrast = getContrastFromLightness(
    colorLightness - multiplier,
    color,
    leoBackgroundColor.colorKeys[0],
  );
  const baseActiveContrast = getContrastFromLightness(
    colorLightness - multiplier * 2,
    color,
    leoBackgroundColor.colorKeys[0],
  );

  const textSubLightLightness = contrastMode === 'aa' ? 42 : 30;
  const textDefLightLightness = contrastMode === 'aa' ? 18 : 12;

  const textSubDarkLightness = contrastMode === 'aa' ? 67 : 80;
  const textDefDarkLightness = contrastMode === 'aa' ? 90 : 94;

  let lightnessScale: number[] = [];

  if (mode === 'light') {
    lightnessScale = [100, 96, 90, 84, 78, 76, 54, 33, textSubLightLightness, textDefLightLightness];
  } else if (mode === 'dark') {
    lightnessScale = [10, 14, 20, 26, 32, 35, 47, 77, textSubDarkLightness, textDefDarkLightness];
  } else {
    lightnessScale = [1, 6, 14, 20, 26, 58, 70, 82, 80, 95];
  }

  const getColorContrasts = (color: CssColor, lightnessScale: number[], backgroundColor: CssColor) => {
    return lightnessScale.map((lightness) => getContrastFromLightness(lightness, color, backgroundColor));
  };

  return new Color({
    name: 'color',
    colorKeys: [color],
    ratios: [
      ...getColorContrasts(color, lightnessScale.slice(0, 8), leoBackgroundColor.colorKeys[0]),
      baseDefaultContrast,
      baseHoverContrast,
      baseActiveContrast,
      ...getColorContrasts(color, lightnessScale.slice(8), leoBackgroundColor.colorKeys[0]),
    ],
  });
};

/**
 *
 * Generates a color scale based on a base color and a mode.
 *
 * @param color The base color that is used to generate the color scale
 * @param mode The mode of the theme
 */
export const generateScaleForColor = (
  color: CssColor,
  mode: ColorMode,
  contrastMode: 'aa' | 'aaa' = 'aa',
): ColorInfo[] => {
  const themeColor = generateThemeColor(color, mode, contrastMode);

  const leoBackgroundColor = new BackgroundColor({
    name: 'backgroundColor',
    colorKeys: ['#ffffff'],
    ratios: [1],
  });

  const theme = new Theme({
    colors: [themeColor],
    backgroundColor: leoBackgroundColor,
    lightness: 100,
  });

  const outputArray: ColorInfo[] = [];
  for (let i = 0; i < theme.contrastColorValues.length; i++) {
    outputArray.push({
      hex: theme.contrastColorValues[i],
      number: (i + 1) as ColorNumber,
      name: getColorNameFromNumber((i + 1) as ColorNumber),
    });
  }
  outputArray.push({
    hex: calculateContrastOneColor(theme.contrastColorValues[8]),
    number: 14,
    name: getColorNameFromNumber(14),
  });
  outputArray.push({
    hex: calculateContrastTwoColor(theme.contrastColorValues[8]),
    number: 15,
    name: getColorNameFromNumber(15),
  });

  if (mode === 'light') {
    outputArray[8].hex = color;
  }

  return outputArray;
};

/**
 *
 * Generates a color theme based on a base color. Light, Dark and Contrast scales are includes.
 *
 * @param color The base color that is used to generate the color theme
 */
export const generateThemeForColor = (color: CssColor, contrastMode: 'aa' | 'aaa' = 'aa'): ThemeInfo => {
  const lightScale = generateScaleForColor(color, 'light', contrastMode);
  const darkScale = generateScaleForColor(color, 'dark', contrastMode);
  const contrastScale = generateScaleForColor(color, 'contrast', contrastMode);

  return {
    light: lightScale,
    dark: darkScale,
    contrast: contrastScale,
  };
};

export const generateGlobalColors = ({ contrastMode = 'aa' }: GlobalGenType) => {
  const blueTheme = generateThemeForColor(baseColors.blue, contrastMode);
  const greenTheme = generateThemeForColor(baseColors.green, contrastMode);
  const orangeTheme = generateThemeForColor(baseColors.orange, contrastMode);
  const purpleTheme = generateThemeForColor(baseColors.purple, contrastMode);
  const redTheme = generateThemeForColor(baseColors.red, contrastMode);
  const yellowTheme = generateThemeForColor(baseColors.yellow, contrastMode);

  return {
    blue: blueTheme,
    green: greenTheme,
    orange: orangeTheme,
    purple: purpleTheme,
    red: redTheme,
    yellow: yellowTheme,
  };
};

/**
 * This function generates a complete theme for a set of colors.
 *
 * @param colors Which colors to generate the theme for
 * @param contrastMode The contrast mode to use
 * @returns
 */
export const generateColorTheme = ({ colors, contrastMode = 'aa' }: ThemeGenType): Record<ThemeColors, ThemeInfo> => {
  const accentTheme = generateThemeForColor(colors.accent, contrastMode);
  const neutralTheme = generateThemeForColor(colors.neutral, contrastMode);
  const brand1Theme = generateThemeForColor(colors.brand1, contrastMode);
  const brand2Theme = generateThemeForColor(colors.brand2, contrastMode);
  const brand3Theme = generateThemeForColor(colors.brand3, contrastMode);

  return {
    accent: accentTheme,
    neutral: neutralTheme,
    brand1: brand1Theme,
    brand2: brand2Theme,
    brand3: brand3Theme,
  };
};

/**
 *
 * This function calculates a color that can be used as a strong contrast color to a base color.
 *
 * @param baseColor The base color
 */
export const calculateContrastOneColor = (baseColor: CssColor) => {
  const contrastWhite = getContrastFromHex(baseColor, '#ffffff');
  const contrastBlack = getContrastFromHex(baseColor, '#000000');
  const lightness = contrastWhite >= contrastBlack ? 100 : 0;
  // const color = createColorWithLightness(baseColor, lightness);

  return lightness === 0 ? '#000000' : '#ffffff';
};

/**
 *
 * This function calculates a color that can be used as a subtle contrast color to a base color.
 *
 * @param color The base color
 */
export const calculateContrastTwoColor = (color: CssColor) => {
  const contrastWhite = getContrastFromHex(color, '#ffffff');
  const contrastBlack = getContrastFromHex(color, '#000000');
  const lightness = getLightnessFromHex(color);
  const doubleALightnessModifier = lightness <= 40 ? 60 : lightness >= 60 ? 60 : 50;

  let targetLightness = 0;
  const contrastDirection = contrastWhite >= contrastBlack ? 'lighten' : 'darken';

  targetLightness =
    contrastDirection === 'lighten' ? lightness + doubleALightnessModifier : lightness - doubleALightnessModifier;

  return createColorWithLightness(color, targetLightness);
};

/**
 *
 * This function checks if white or black text can be used on 2 different colors at 4.5:1 contrast.
 *
 * @param baseDefaultColor Base default color
 * @param baseActiveColor Base active color
 */
export const canTextBeUsedOnColors = (baseDefaultColor: CssColor, baseActiveColor: CssColor) => {
  const defaultAgainstWhite = getContrastFromHex(baseDefaultColor, '#ffffff');
  const defaultAgainstBlack = getContrastFromHex(baseDefaultColor, '#000000');

  const activeAgainstWhite = getContrastFromHex(baseActiveColor, '#ffffff');
  const activeAgainstBlack = getContrastFromHex(baseActiveColor, '#000000');

  if (defaultAgainstWhite >= 4.5 && activeAgainstWhite >= 4.5) {
    return true;
  }
  if (defaultAgainstBlack >= 4.5 && activeAgainstBlack >= 4.5) {
    return true;
  }

  return false;
};

/**
 *
 * This function creates a color with a specific lightness value.
 *
 * @param color The base color
 * @param lightness The lightness value from 0 to 100
 */
export const createColorWithLightness = (color: CssColor, lightness: number) => {
  const leoBackgroundColor = new BackgroundColor({
    name: 'backgroundColor',
    colorKeys: ['#ffffff'],
    ratios: [1],
  });
  const colors = new Color({
    name: 'color',
    colorKeys: [color],
    ratios: [getContrastFromLightness(lightness, color, '#ffffff')],
  });

  const theme = new Theme({
    colors: [colors],
    backgroundColor: leoBackgroundColor,
    lightness: 100,
  });
  return theme.contrastColorValues[0];
};

/**
 *
 * This function returns the color number based on the color name.
 *
 * @param name The name of the color
 */
export const getColorNumberFromName = (name: string): ColorNumber => {
  const colorMap: { [key: string]: ColorNumber } = {
    'Background Default': 1,
    'Background Subtle': 2,
    'Surface Default': 3,
    'Surface Hover': 4,
    'Surface Active': 5,
    'Border Subtle': 6,
    'Border Default': 7,
    'Border Strong': 8,
    'Base Default': 9,
    'Base Hover': 10,
    'Base Active': 11,
    'Text Subtle': 12,
    'Text Default': 13,
    'Contrast Default': 14,
    'Contrast Subtle': 15,
  };
  return colorMap[name];
};

/**
 *
 * This function returns the color name based on the color number.
 *
 * @param number The number of the color
 */
export const getColorNameFromNumber = (number: ColorNumber): string => {
  const colorMap: { [key in ColorNumber]: string } = {
    1: 'Background Default',
    2: 'Background Subtle',
    3: 'Surface Default',
    4: 'Surface Hover',
    5: 'Surface Active',
    6: 'Border Subtle',
    7: 'Border Default',
    8: 'Border Strong',
    9: 'Base Default',
    10: 'Base Hover',
    11: 'Base Active',
    12: 'Text Subtle',
    13: 'Text Default',
    14: 'Contrast Default',
    15: 'Contrast Subtle',
  };
  return colorMap[number];
};

export const getBaseColor = (color: CssColor) => {
  const conv = new Hsluv();
  conv.hex = color;
  conv.hexToHsluv();
  // conv.hsluv_l = 100 - conv.hsluv_l;
  // conv.hsluv_s = getSaturationForDarkMode(color, conv.hsluv_s);
  conv.hsluvToHex();

  return conv.hex as CssColor;
};

export const getCssVariable = (colorType: string, colorNumber: ColorNumber) => {
  return `--ds-${colorType}-${getColorNameFromNumber(colorNumber).toLowerCase().replace(/\s/g, '-')}`;
};
