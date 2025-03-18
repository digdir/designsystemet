import type { Color, CssColor } from '@digdir/designsystemet/color';

import type {
  ColorScheme,
  GlobalColors,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import {
  getLightnessFromHex,
  getLuminanceFromLightness,
  getSaturationFromHex,
} from '@digdir/designsystemet/color';
import chroma from 'chroma-js';
import * as R from 'ramda';
import type { ColorMetadataType, ThemeSettingsType } from '../debugStore';

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
  colorMetadata: ColorMetadataType,
  themeSettings: ThemeSettingsType,
): Color[] => {
  const colors = R.mapObjIndexed((colorData) => {
    const luminance = colorData.luminance[colorScheme];
    return {
      ...colorData,
      hex: chroma(color)
        .luminance(luminance, themeSettings.interpolation.mode)
        .hex() as CssColor,
    };
  }, colorMetadata);

  // Generate base colors
  const baseColors = generateBaseColors(color, colorScheme, themeSettings);
  colors['base-default'] = {
    ...colors['base-default'],
    hex: baseColors.default,
  };
  colors['base-hover'] = { ...colors['base-hover'], hex: baseColors.hover };
  colors['base-active'] = { ...colors['base-active'], hex: baseColors.active };
  colors['base-contrast-subtle'] = {
    ...colors['base-contrast-subtle'],
    hex: generateColorContrast(baseColors.default, 'subtle'),
  };
  colors['base-contrast-default'] = {
    ...colors['base-contrast-default'],
    hex: generateColorContrast(baseColors.default, 'default'),
  };

  return Object.values(colors);
};

/**
 * Generates color schemes based on a base color. Light, Dark and Contrast scales are included.
 *
 * @param color The base color that is used to generate the color schemes
 */
export const generateColorSchemes = (
  color: CssColor,
  colorMetadata: ColorMetadataType,
  themeSettings: ThemeSettingsType,
): ThemeInfo => ({
  light: generateColorScale(color, 'light', colorMetadata, themeSettings),
  dark: generateColorScale(color, 'dark', colorMetadata, themeSettings),
  contrast: generateColorScale(color, 'contrast', colorMetadata, themeSettings),
});

/**
 * Returns the base colors for a color and color scheme.
 *
 * @param color The base color as a hex string
 * @param colorScheme The color scheme to generate the base colors for
 * @returns
 */
const generateBaseColors = (
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

  const baseRefColor = color;
  // Reduce saturation if it is too high in dark mode
  if (colorScheme === 'dark') {
    colorLightness -= 40;
  }

  return {
    default:
      colorScheme === 'light'
        ? color
        : (chroma(baseRefColor)
            .luminance(getLuminanceFromLightness(colorLightness))
            .hex() as CssColor),
    hover: chroma(baseRefColor)
      .luminance(
        getLuminanceFromLightness(calculateLightness(colorLightness, modifier)),
      )
      .hex() as CssColor,
    active: chroma(baseRefColor)
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

/**
 * Generates contrast color for given color
 *
 * @param color color
 * @param type 'default' | 'subtle'
 */
export const generateColorContrast = (
  color: CssColor,
  type: 'default' | 'subtle',
): CssColor => {
  if (type === 'default') {
    return chroma.contrast(color, '#ffffff') >=
      chroma.contrast(color, '#000000')
      ? '#ffffff'
      : '#000000';
  }

  if (type === 'subtle') {
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
  }

  return color;
};
