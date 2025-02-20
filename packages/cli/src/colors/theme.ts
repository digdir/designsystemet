import chroma from 'chroma-js';
import * as R from 'ramda';
import { colorMetadata, getColorMetadataByNumber } from './colorMetadata.js';
import type { CssColor } from './types.js';
import type { Color, ColorNumber, ColorScheme, ThemeInfo } from './types.js';
import { getLightnessFromHex, getLuminanceFromLightness } from './utils.js';

/**
 * Generates a color scale based on a base color and a color mode.
 *
 * @param color The base color that is used to generate the color scale
 * @param colorScheme The color scheme to generate a scale for
 */
export const generateColorScale = (color: CssColor, colorScheme: ColorScheme): Color[] => {
  const colors = R.mapObjIndexed((colorData) => {
    const luminance = colorData.luminance[colorScheme];
    return {
      ...colorData,
      hex: chroma(color).luminance(luminance).hex() as CssColor,
    };
  }, colorMetadata);

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
 */
export const generateColorSchemes = (color: CssColor): ThemeInfo => ({
  light: generateColorScale(color, 'light'),
  dark: generateColorScale(color, 'dark'),
  contrast: generateColorScale(color, 'contrast'),
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
