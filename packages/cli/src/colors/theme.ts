import chroma from 'chroma-js';
import * as R from 'ramda';
import { colorMetadata, getColorMetadataByNumber } from './colorMetadata.js';
import type { CssColor } from './types.js';
import type { Color, ColorNumber, ColorScheme, ThemeInfo } from './types.js';
import { getLightnessFromHex, getLuminanceFromLightness } from './utils.js';

export const RESERVED_COLORS = [
  'neutral',
  'success',
  'warning',
  'danger',
  'info',
  'blue',
  'green',
  'orange',
  'purple',
  'red',
];

/**
 * Generates a color scale based on a base color and a color mode.
 *
 * @param color The base color that is used to generate the color scale
 * @param colorScheme The color scheme to generate a scale for
 * @param colorMetaData The metadata for the color
 */
export const generateColorScale = (
  color: CssColor,
  colorScheme: ColorScheme,
  colorMetaData?: typeof colorMetadata,
  staticSaturation?: number,
): Color[] => {
  let interpolationColor = color;

  // Reduce saturation in dark mode for the interpolation colors
  if (colorScheme === 'dark') {
    const [L, C, H] = chroma(color).oklch();
    const chromaModifier = 0.7;
    interpolationColor = chroma(L, C * chromaModifier, H, 'oklch').hex() as CssColor;
  } else {
    const [H, S, V] = chroma(color).hsv();
    interpolationColor = chroma(
      H,
      Math.min(S * (staticSaturation ?? 1), 1),
      Math.min(V * (staticSaturation ?? 1), 1),
      'hsv',
    ).hex() as CssColor;
  }

  const colors = R.mapObjIndexed((colorData) => {
    const lightness = colorData.luminance[colorScheme];
    return {
      ...colorData,
      hex: chroma(interpolationColor).luminance(getLuminanceFromLightness(lightness)).hex() as CssColor,
    };
  }, colorMetaData || colorMetadata);

  // Generate base colors
  const baseColors = generateBaseColors(color, colorScheme);
  colors['base-default'] = { ...colors['base-default'], hex: baseColors.default };
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
 * @param colorMetaData The metadata for the color
 * @param staticSaturation The static saturation value for the color
 */
export const generateColorSchemes = (
  color: CssColor,
  colorMetaData?: typeof colorMetadata,
  staticSaturation?: number,
): ThemeInfo => ({
  light: generateColorScale(color, 'light', colorMetaData, staticSaturation),
  dark: generateColorScale(color, 'dark', colorMetaData, staticSaturation),
  contrast: generateColorScale(color, 'contrast', colorMetaData, staticSaturation),
});

/**
 * Returns the base colors for a color and color scheme.
 *
 * @param color The base color
 * @param colorScheme The color scheme to generate the base colors for
 * @returns
 */
const generateBaseColors = (color: CssColor, colorScheme: ColorScheme) => {
  let colorLightness = getLightnessFromHex(color);
  if (colorScheme !== 'light') {
    colorLightness = colorLightness <= 30 ? 70 : 100 - colorLightness;
  }

  const modifier = colorLightness <= 30 || (colorLightness >= 49 && colorLightness <= 65) ? -8 : 8;
  const calculateLightness = (base: number, mod: number) => base - mod;

  return {
    default:
      colorScheme === 'light'
        ? color
        : (chroma(color).luminance(getLuminanceFromLightness(colorLightness)).hex() as CssColor),
    hover: chroma(color)
      .luminance(getLuminanceFromLightness(calculateLightness(colorLightness, modifier)))
      .hex() as CssColor,
    active: chroma(color)
      .luminance(getLuminanceFromLightness(calculateLightness(colorLightness, modifier * 2)))
      .hex() as CssColor,
  };
};

/**
 * Generates contrast color for given color
 *
 * @param color color
 * @param type 'default' | 'subtle'
 */
export const generateColorContrast = (color: CssColor, type: 'default' | 'subtle'): CssColor => {
  if (type === 'default') {
    return chroma.contrast(color, '#ffffff') >= chroma.contrast(color, '#000000') ? '#ffffff' : '#000000';
  }

  if (type === 'subtle') {
    const contrastWhite = chroma.contrast(color, '#ffffff');
    const contrastBlack = chroma.contrast(color, '#000000');
    const lightness = getLightnessFromHex(color);
    const modifier = lightness <= 40 || lightness >= 60 ? 60 : 50;
    const targetLightness = contrastWhite >= contrastBlack ? lightness + modifier : lightness - modifier;

    return chroma(color).luminance(getLuminanceFromLightness(targetLightness)).hex() as CssColor;
  }

  return color;
};

/**
 * Returns the css variable for a color.
 * TODO: deprecate this
 * @param colorType The type of color
 * @param colorNumber The number of the color
 */
export const getCssVariable = (colorType: string, colorNumber: ColorNumber) => {
  return `--ds-color-${colorType}-${getColorMetadataByNumber(colorNumber).displayName.toLowerCase().replace(/\s/g, '-')}`;
};
