import type { CssColor } from './types.js';

import chroma from 'chroma-js';
import { luminance } from './luminance.js';
import type { ColorInfo, ColorNumber, ColorScheme, ThemeInfo } from './types.js';
import {
  getColorInfoFromPosition,
  getLightnessFromHex,
  getLuminanceFromLightness,
  getSaturationFromHex,
} from './utils.js';

/**
 * Generates a color scale based on a base color and a color mode.
 *
 * @param color The base color that is used to generate the color scale
 * @param colorScheme The color scheme to generate a scale for
 */
export const generateColorScale = (color: CssColor, colorScheme: ColorScheme): ColorInfo[] => {
  const baseColors = getBaseColors(color, colorScheme);
  const luminanceValues = luminance[colorScheme];

  // Create the color scale based on luminance values. The chroma().luminance function uses RGB interpolation by default.
  const outputArray: ColorInfo[] = Object.entries(luminanceValues).map(([, value], index) => {
    const position = (index + 1) as ColorNumber;
    const colorInfo = getColorInfoFromPosition(position);
    return {
      name: colorInfo.name,
      displayName: colorInfo.displayName,
      group: colorInfo.group,
      hex: chroma(colorScheme === 'light' ? baseColors.baseDefault : getDarkModeRefColor(color, baseColors.baseDefault))
        .luminance(value)
        .hex() as CssColor,
      position,
    };
  });

  const createSpecialColor = (position: ColorNumber, hexValue: CssColor) => {
    const info = getColorInfoFromPosition(position);
    return {
      name: info.name,
      displayName: info.displayName,
      group: info.group,
      hex: hexValue,
      position,
    };
  };

  const specialColors: Omit<ColorInfo, 'id'>[] = [
    createSpecialColor(12, baseColors.baseDefault),
    createSpecialColor(13, baseColors.baseHover),
    createSpecialColor(14, baseColors.baseActive),
    createSpecialColor(15, getContrastSubtle(baseColors.baseDefault)),
    createSpecialColor(16, getContrastDefault(baseColors.baseDefault)),
  ];

  // Add the special colors to the output array
  for (const { hex, position, name, displayName, group } of specialColors) {
    outputArray[position - 1] = {
      hex,
      position,
      name,
      displayName,
      group,
    };
  }
  return outputArray;
};

/**
 * Generates color schemes based on a base color. Light, Dark and Contrast scales are included.
 *
 * @param color The base color that is used to generate the color schemes
 */
export const generateColorSchemes = (color: CssColor): ThemeInfo => ({
  light: generateColorScale(color, 'light'),
  dark: generateColorScale(color, 'dark'),
  contrast: generateColorScale(color, 'contrast'),
});

/**
 * Returns the base colors for a color and color scheme.
 *
 * @param color The base color as a hex string
 * @param colorScheme The color scheme to generate the base colors for
 * @returns
 */
const getBaseColors = (color: CssColor, colorScheme: ColorScheme) => {
  let colorLightness = getLightnessFromHex(color);
  if (colorScheme !== 'light') {
    colorLightness = colorLightness <= 30 ? 70 : 100 - colorLightness;
  }

  const modifier = colorLightness <= 30 || (colorLightness >= 49 && colorLightness <= 65) ? -8 : 8;
  const calculateLightness = (base: number, mod: number) => base - mod;

  let baseRefColor =
    colorScheme === 'light'
      ? color
      : (chroma(color).luminance(getLuminanceFromLightness(colorLightness)).hex() as CssColor);

  // Reduce saturation if it is too high in dark mode
  if (colorScheme === 'dark') {
    const saturation = getSaturationFromHex(baseRefColor);
    const lightness = getLightnessFromHex(baseRefColor);
    if (saturation >= 70 && lightness >= 45) {
      const saturationModifier = 1.5 * ((saturation - 70) / 30);
      baseRefColor = chroma(baseRefColor).desaturate(saturationModifier).hex() as CssColor;
    }
  }

  return {
    baseDefault:
      colorScheme === 'light'
        ? color
        : (chroma(baseRefColor).luminance(getLuminanceFromLightness(colorLightness)).hex() as CssColor),
    baseHover: chroma(baseRefColor)
      .luminance(getLuminanceFromLightness(calculateLightness(colorLightness, modifier)))
      .hex() as CssColor,
    baseActive: chroma(baseRefColor)
      .luminance(getLuminanceFromLightness(calculateLightness(colorLightness, modifier * 2)))
      .hex() as CssColor,
  };
};

/**
 * Returns the reference color used to generate the luminance values for dark mode
 *
 * @param originalBase The original base color
 * @param processedBase The processed base default color
 */
const getDarkModeRefColor = (originalBase: CssColor, processedBase: CssColor) => {
  const colorLightness = getLightnessFromHex(originalBase);
  const colorSaturation = getSaturationFromHex(originalBase);
  let lightness = 0;

  if (colorLightness <= 28) {
    lightness = colorSaturation >= 70 ? 30 : 40;
    lightness = colorSaturation >= 90 ? 32 : 40;
  } else if (colorLightness <= 60) {
    if (colorSaturation < 75) {
      return processedBase;
    }
    const minLight = colorLightness <= 45 ? 33 : 50;
    const maxLight = colorLightness <= 45 ? 48 : 60;
    lightness = getLightnessInterpol(colorSaturation, 75, 100, minLight, maxLight);
  } else {
    return processedBase;
  }

  return chroma(originalBase).luminance(getLuminanceFromLightness(lightness)).hex();
};

/**
 * Returns the lightness value for a given saturation value
 *
 * @param saturation
 * @param minSat
 * @param maxSat
 * @param minLight
 * @param maxLight
 * @returns
 */
const getLightnessInterpol = (
  saturation: number,
  minSat: number,
  maxSat: number,
  minLight: number,
  maxLight: number,
) => {
  if (saturation >= maxSat) return maxLight;
  if (saturation <= minSat) return minLight;

  // Linear interpolation formula
  const ratio = (saturation - minSat) / (maxSat - minSat);
  return minLight + ratio * (maxLight - minLight);
};

/**
 * Creates the Base Contrast Default color
 *
 * @param baseColor The base color
 */
export const getContrastDefault = (color: CssColor): CssColor =>
  chroma.contrast(color, '#ffffff') >= chroma.contrast(color, '#000000') ? '#ffffff' : '#000000';

/**
 * Creates the Base Contrast Subtle color
 *
 * @param color The base color
 */
export const getContrastSubtle = (color: CssColor): CssColor => {
  const contrastWhite = chroma.contrast(color, '#ffffff');
  const contrastBlack = chroma.contrast(color, '#000000');
  const lightness = getLightnessFromHex(color);
  const modifier = lightness <= 40 || lightness >= 60 ? 60 : 50;
  const targetLightness = contrastWhite >= contrastBlack ? lightness + modifier : lightness - modifier;

  return chroma(color).luminance(getLuminanceFromLightness(targetLightness)).hex() as CssColor;
};

/**
 * Returns the css variable for a color.
 *
 * @param colorType The type of color
 * @param colorNumber The number of the color
 */
export const getCssVariable = (colorType: string, colorNumber: ColorNumber) => {
  return `--ds-color-${colorType}-${getColorInfoFromPosition(colorNumber).displayName.toLowerCase().replace(/\s/g, '-')}`;
};
