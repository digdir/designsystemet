import chroma from 'chroma-js';
import * as R from 'ramda';
import { colorMetadata } from './colorMetadata.js';
import type { CssColor } from './types.js';
import type { ColorInfo, ColorNumber, ColorScheme, ThemeInfo } from './types.js';
import { getColorInfoFromPosition, getLightnessFromHex, getLuminanceFromLightness } from './utils.js';

/**
 * Generates a color scale based on a base color and a color mode.
 *
 * @param color The base color that is used to generate the color scale
 * @param colorScheme The color scheme to generate a scale for
 */
export const generateColorScale = (color: CssColor, colorScheme: ColorScheme): ColorInfo[] => {
  const baseColors = generateBaseColors(color, colorScheme);

  const colors = R.mapObjIndexed((colorData, key) => {
    const luminance = colorData.luminance[colorScheme];
    return {
      ...colorData,
      hex: chroma(color).luminance(luminance).hex() as CssColor,
      position: parseInt(key) as ColorNumber,
    };
  }, colorMetadata);

  colors['12'] = { ...colors['12'], hex: baseColors.default };
  colors['13'] = { ...colors['13'], hex: baseColors.hover };
  colors['14'] = { ...colors['14'], hex: baseColors.active };
  colors['15'] = { ...colors['15'], hex: generateSubtleContrast(baseColors.default) };
  colors['16'] = { ...colors['16'], hex: generateBaseDefaultContrast(baseColors.default) };

  return Object.values(colors);
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
 * Creates the default contrast color for a base color
 *
 * @param baseColor The base color
 */
export const generateBaseDefaultContrast = (color: CssColor): CssColor =>
  chroma.contrast(color, '#ffffff') >= chroma.contrast(color, '#000000') ? '#ffffff' : '#000000';

/**
 * Creates the subtle contrast color for a base color
 *
 * @param color The base color
 */
export const generateSubtleContrast = (color: CssColor): CssColor => {
  const contrastWhite = chroma.contrast(color, '#ffffff');
  const contrastBlack = chroma.contrast(color, '#000000');
  const lightness = getLightnessFromHex(color);
  const modifier = lightness <= 40 || lightness >= 60 ? 60 : 50;
  const targetLightness = contrastWhite >= contrastBlack ? lightness + modifier : lightness - modifier;

  return chroma(color).luminance(getLuminanceFromLightness(targetLightness)).hex() as CssColor;
};

/**
 * Returns the css variable for a color.
 * TODO: deprecate this
 * @param colorType The type of color
 * @param colorNumber The number of the color
 */
export const getCssVariable = (colorType: string, colorNumber: ColorNumber) => {
  return `--ds-color-${colorType}-${getColorInfoFromPosition(colorNumber).displayName.toLowerCase().replace(/\s/g, '-')}`;
};
