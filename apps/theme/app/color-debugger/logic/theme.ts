import type { CssColor } from '@digdir/designsystemet/color';

import type {
  ColorInfo,
  ColorNumber,
  ColorScheme,
  GlobalColors,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import {
  getColorInfoFromPosition,
  getLightnessFromHex,
  getLuminanceFromLightness,
  getSaturationFromHex,
} from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import type { ThemeSettingsType } from '../debugStore';

export const baseColors: Record<GlobalColors, CssColor> = {
  blue: '#0A71C0',
  green: '#068718',
  orange: '#B8581D',
  purple: '#663299',
  red: '#C01B1B',
};

export type InterpolationMode =
  | 'rgb'
  | 'hsl'
  | 'hsv'
  | 'hsi'
  | 'lab'
  | 'oklab'
  | 'lch'
  | 'oklch'
  | 'hcl'
  | 'lrgb';

/**
 * Generates a color scale based on a base color and a color mode.
 *
 * @param color The base color that is used to generate the color scale
 * @param colorScheme The color scheme to generate a scale for
 */
export const generateColorScale = (
  color: CssColor,
  colorScheme: ColorScheme,
  luminance: Record<string, Record<string, number>> | undefined,
  themeSettings: ThemeSettingsType,
): ColorInfo[] => {
  const baseColors = getBaseColors(color, colorScheme, themeSettings);
  const luminanceValues = luminance?.[colorScheme];

  // Create the color scale based on the luminance values. The chroma().luminance function uses RGB interpolation by default.
  const outputArray: ColorInfo[] = Object.entries(luminanceValues || {}).map(
    ([, value], index) => {
      const position = (index + 1) as ColorNumber;
      const colorInfo = getColorInfoFromPosition(position);
      return {
        name: colorInfo.name,
        displayName: colorInfo.displayName,
        group: colorInfo.group,
        hex: chroma(
          colorScheme === 'light'
            ? baseColors.baseDefault
            : getDarkModeBaseRef(color, baseColors.baseDefault),
        )
          .luminance(value)
          .hex() as CssColor,
        position,
      };
    },
  );

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
export const generateColorSchemes = (
  color: CssColor,
  luminance: Record<string, Record<string, number>> | undefined,
  themeSettings: ThemeSettingsType,
): ThemeInfo => ({
  light: generateColorScale(color, 'light', luminance, themeSettings),
  dark: generateColorScale(color, 'dark', luminance, themeSettings),
  contrast: generateColorScale(color, 'contrast', luminance, themeSettings),
});

/**
 * Returns the base colors for a color and color scheme.
 *
 * @param color The base color as a hex string
 * @param colorScheme The color scheme to generate the base colors for
 * @returns
 */
const getBaseColors = (
  color: CssColor,
  colorScheme: ColorScheme,
  themeSettings: ThemeSettingsType,
) => {
  let colorLightness = getLightnessFromHex(color);
  const baseModifier = themeSettings.base?.modifier || 8;
  const baseNegativeModeMin = themeSettings.base?.negativeModeMin;
  const baseNegativeModRangeMin = themeSettings.base?.negativeModRangeMin;
  const baseNegativeModRangeMax = themeSettings.base?.negativeModRangeMax;

  if (colorScheme !== 'light') {
    colorLightness = colorLightness <= 30 ? 70 : 100 - colorLightness;
  }

  const modifier =
    colorLightness <= baseNegativeModeMin ||
    (colorLightness >= baseNegativeModRangeMin &&
      colorLightness <= baseNegativeModRangeMax)
      ? -baseModifier
      : baseModifier;
  const calculateLightness = (base: number, mod: number) => base - mod;

  let baseRefColor =
    colorScheme === 'light'
      ? color
      : (chroma(color)
          .luminance(getLuminanceFromLightness(colorLightness))
          .hex() as CssColor);

  // Reduce the saturation of the base color if it is too high in dark mode
  if (colorScheme === 'dark') {
    const saturation = getSaturationFromHex(baseRefColor);
    const lightness = getLightnessFromHex(baseRefColor);
    if (saturation >= 70 && lightness >= 45) {
      const saturationModifier = 1 * ((saturation - 70) / 30);
      baseRefColor = chroma(baseRefColor)
        .desaturate(saturationModifier)
        .hex() as CssColor;
    }
  }

  return {
    baseDefault:
      colorScheme === 'light'
        ? color
        : (chroma(baseRefColor)
            .luminance(getLuminanceFromLightness(colorLightness))
            .hex() as CssColor),
    baseHover: chroma(baseRefColor)
      .luminance(
        getLuminanceFromLightness(calculateLightness(colorLightness, modifier)),
      )
      .hex() as CssColor,
    baseActive: chroma(baseRefColor)
      .luminance(
        getLuminanceFromLightness(
          calculateLightness(colorLightness, modifier * 2),
        ),
      )
      .hex() as CssColor,
  };
};

/**
 * Returns the color to be used to generate the luminance colors for dark mode
 *
 * @param color The original base color
 * @param baseDefault The new base default color
 */
const getDarkModeBaseRef = (
  color: CssColor,
  baseDefault: CssColor,
): CssColor => {
  const colorLightness = getLightnessFromHex(color);
  const colorSaturation = getSaturationFromHex(color);
  let targetLightness: number | null = null;

  return baseDefault;

  if (colorLightness <= 30) {
    targetLightness = colorSaturation >= 70 ? 30 : 40;
  } else if (colorLightness <= 45) {
    targetLightness = colorSaturation >= 80 ? 45 : 55;
  } else if (colorLightness <= 60) {
    targetLightness = colorSaturation >= 80 ? 55 : 65;
  }

  if (targetLightness === null) {
    return baseDefault;
  }

  return chroma(color)
    .luminance(getLuminanceFromLightness(targetLightness))
    .hex() as CssColor;
};

/**
 * Creates the Base Contrast Default color
 *
 * @param baseColor The base color
 */
export const getContrastDefault = (color: CssColor): CssColor =>
  chroma.contrast(color, '#ffffff') >= chroma.contrast(color, '#000000')
    ? '#ffffff'
    : '#000000';

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
  const targetLightness =
    contrastWhite >= contrastBlack
      ? lightness + modifier
      : lightness - modifier;

  return chroma(color)
    .luminance(getLuminanceFromLightness(targetLightness))
    .hex() as CssColor;
};
