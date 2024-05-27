import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { BackgroundColor, Color, Theme } from '@adobe/leonardo-contrast-colors';
import { Hsluv } from 'hsluv';

import type { modeType } from '../types';

import {
  getContrastFromHex,
  getContrastFromLightness,
  getLightnessFromHex,
} from './colorUtils';

export type ColorType = 'accent' | 'neutral' | 'brand1' | 'brand2' | 'brand3';
export type ThemeType = {
  light: CssColor[];
  dark: CssColor[];
  contrast: CssColor[];
};

/**
 *
 * This function generates a color scale based on a base color and a mode. The mode determines the lightness of the colors in the scale.
 *
 * @param color The base color that is used to generate the color scale
 * @param mode The mode of the theme
 */
export const generateColorScale = (
  color: CssColor,
  mode: modeType,
  contrastMode: 'aa' | 'aaa' = 'aa',
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
): CssColor[] => {
  const leoBackgroundColor = new BackgroundColor({
    name: 'backgroundColor',
    colorKeys: ['#ffffff'],
    ratios: [1],
  });

  if (mode === 'dark') {
    color = getBaseColorForDarkmode(color);
  }

  if (mode === 'contrast') {
    color = getBaseColorForDarkmode(color);
  }

  const colorLightness = getLightnessFromHex(color);
  const multiplier = colorLightness <= 30 ? -8 : 8;
  const baseDefaultContrast = getContrastFromLightness(
    colorLightness,
    color,
    leoBackgroundColor.colorKeys[0],
  );
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
  const textDefLightLightness = contrastMode === 'aa' ? 20 : 17;

  const textSubDarkLightness = contrastMode === 'aa' ? 65 : 78;
  const textDefDarkLightness = contrastMode === 'aa' ? 89 : 93;

  let lightnessScale: number[] = [];

  if (mode === 'light') {
    lightnessScale = [
      100,
      96,
      90,
      84,
      78,
      76,
      54,
      33,
      textSubLightLightness,
      textDefLightLightness,
    ];
  } else if (mode === 'dark') {
    lightnessScale = [
      10,
      14,
      20,
      26,
      32,
      35,
      47,
      77,
      textSubDarkLightness,
      textDefDarkLightness,
    ];
  } else {
    lightnessScale = [1, 6, 14, 20, 26, 58, 70, 82, 80, 95];
  }

  const getColorContrasts = (
    color: CssColor,
    lightnessScale: number[],
    backgroundColor: CssColor,
  ) => {
    return lightnessScale.map((lightness) =>
      getContrastFromLightness(lightness, color, backgroundColor),
    );
  };

  const colors = new Color({
    name: 'color',
    colorKeys: [color],
    ratios: [
      ...getColorContrasts(
        color,
        lightnessScale.slice(0, 8),
        leoBackgroundColor.colorKeys[0],
      ),
      baseDefaultContrast,
      baseHoverContrast,
      baseActiveContrast,
      ...getColorContrasts(
        color,
        lightnessScale.slice(8),
        leoBackgroundColor.colorKeys[0],
      ),
    ],
  });

  const theme = new Theme({
    colors: [colors],
    backgroundColor: leoBackgroundColor,
    lightness: 100,
  });

  // Creates a flat array of the 13 colors in the theme
  const themeArray = theme.contrastColorValues;

  // Add contrast colors to the end of the array
  themeArray.push(calculateContrastOneColor(themeArray[8]));
  themeArray.push(calculateContrastTwoColor(themeArray[8]));

  return theme.contrastColorValues;
};

/**
 *
 * This function generates a color theme based on a base color. Light, Dark and Contrast scales are generated.
 *
 * @param color The base color that is used to generate the color theme
 */
export const generateColorTheme = (
  color: CssColor,
  contrastMode: 'aa' | 'aaa' = 'aa',
) => {
  const lightScale = generateColorScale(color, 'light', contrastMode);
  const darkScale = generateColorScale(color, 'dark', contrastMode);
  const contrastScale = generateColorScale(color, 'contrast', contrastMode);

  return {
    light: lightScale,
    dark: darkScale,
    contrast: contrastScale,
  } as ThemeType;
};

const getBaseColorForDarkmode = (color: CssColor) => {
  const colorLightness = getLightnessFromHex(color);

  const conv = new Hsluv();
  const convLightness = colorLightness < 40 ? 45 : colorLightness;
  conv.hex = color;
  conv.hexToHsluv();
  conv.hsluv_l = convLightness;
  conv.hsluv_s = conv.hsluv_s >= 80 ? 80 : conv.hsluv_s;
  conv.hsluvToHex();

  return conv.hex as CssColor;
};

const calculateContrastOneColor = (baseColor: CssColor) => {
  const contrastWhite = getContrastFromHex(baseColor, '#ffffff');
  const contrastBlack = getContrastFromHex(baseColor, '#000000');
  const lightness = contrastWhite >= contrastBlack ? 100 : 0;
  const color = createColorWithLightness(baseColor, lightness);

  return color;
};

export const calculateContrastTwoColor = (color: CssColor) => {
  const contrastWhite = getContrastFromHex(color, '#ffffff');
  const contrastBlack = getContrastFromHex(color, '#000000');
  const lightness = getLightnessFromHex(color);
  const doubleALightnessModifier =
    lightness <= 40 ? 60 : lightness >= 60 ? 60 : 50;

  let targetLightness = 0;
  const contrastDirection =
    contrastWhite >= contrastBlack ? 'lighten' : 'darken';

  targetLightness =
    contrastDirection === 'lighten'
      ? lightness + doubleALightnessModifier
      : lightness - doubleALightnessModifier;

  return createColorWithLightness(color, targetLightness);
};

/**
 *
 * This function checks if white or black text can be used on 2 different colors at 4.5:1 contrast.
 *
 * @param baseDefaultColor Base default color
 * @param baseActiveColor Base active color
 */
export const canTextBeUsedOnColors = (
  baseDefaultColor: CssColor,
  baseActiveColor: CssColor,
) => {
  const defaultAgainstWhite = getContrastFromHex(baseDefaultColor, '#ffffff');
  const defaultAgainstBlack = getContrastFromHex(baseDefaultColor, '#000000');

  const activeAgainstWhite = getContrastFromHex(baseActiveColor, '#ffffff');
  const activeAgainstBlack = getContrastFromHex(baseActiveColor, '#000000');

  if (defaultAgainstWhite >= 4.5 && activeAgainstWhite >= 4.5) {
    return true;
  } else if (defaultAgainstBlack >= 4.5 && activeAgainstBlack >= 4.5) {
    return true;
  }

  return false;
};

const createColorWithLightness = (color: CssColor, lightness: number) => {
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
