import chroma from 'chroma-js';
import * as R from 'ramda';
import { colorMetadata, getColorMetadataByNumber } from './colorMetadata.js';
import type { CssColor } from './types.js';
import type { Color, ColorMetadataByName, ColorNumber, ColorScheme, ThemeInfo } from './types.js';
import { getBaseDarkLightness, getLightnessFromHex, getLuminanceFromLightness } from './utils.js';

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
  colorMetaData: ColorMetadataByName,
): Color[] => {
  // Generate colors based on the metadata
  const colors = R.mapObjIndexed((colorData) => {
    const { saturation, interpolation, lightness } = colorMetaData[colorData.name];
    const [L, C, H] = chroma(color).oklch();
    const chromaModifier = saturation[colorScheme];
    const interpolColor = chroma(L, C * chromaModifier, H, 'oklch').hex();

    return {
      ...colorData,
      hex: chroma(interpolColor)
        .luminance(getLuminanceFromLightness(lightness[colorScheme]), interpolation || 'rgb')
        .hex() as CssColor,
    };
  }, colorMetaData || colorMetadata);

  // Generate base colors
  const baseColors = generateBaseColors(color, colorScheme, colorMetaData);
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
export const generateColorSchemes = (color: CssColor, colorMetaData?: typeof colorMetadata): ThemeInfo => ({
  light: generateColorScale(color, 'light', colorMetaData || colorMetadata),
  dark: generateColorScale(color, 'dark', colorMetaData || colorMetadata),
  contrast: generateColorScale(color, 'contrast', colorMetaData || colorMetadata),
});

/**
 * Returns the base colors for a color and color scheme.
 *
 * @param color The base color
 * @param colorScheme The color scheme to generate the base colors for
 * @returns
 */
const generateBaseColors = (color: CssColor, colorScheme: ColorScheme, colorMetaData: ColorMetadataByName) => {
  let colorLightness = getLightnessFromHex(color);
  if (colorScheme !== 'light') {
    if (colorMetaData['base-default'].lightness.dark === -1) {
      colorLightness = getBaseDarkLightness(color);
    } else {
      colorLightness = colorMetaData['base-default'].lightness.dark;
    }
  }

  const step = colorMetaData['base-default'].baseModifier[colorScheme];
  const modifier = colorLightness <= 30 || (colorLightness >= 49 && colorLightness <= 65) ? -step : step;
  const calculateLightness = (base: number, mod: number) => base - mod;
  const [L, C, H] = chroma(color).oklch();
  const baseDefaultInterpolColor = chroma(
    L,
    C * colorMetaData['base-default'].saturation[colorScheme],
    H,
    'oklch',
  ).hex();
  const baseHoverInterpolColor = chroma(L, C * colorMetaData['base-hover'].saturation[colorScheme], H, 'oklch').hex();
  const baseActiveInterpolColor = chroma(L, C * colorMetaData['base-active'].saturation[colorScheme], H, 'oklch').hex();

  return {
    default:
      colorScheme === 'light'
        ? color
        : (chroma(baseDefaultInterpolColor)
            .luminance(getLuminanceFromLightness(colorLightness), colorMetaData['base-default'].interpolation)
            .hex() as CssColor),
    hover: chroma(baseHoverInterpolColor)
      .luminance(
        getLuminanceFromLightness(calculateLightness(colorLightness, modifier)),
        colorMetaData['base-hover'].interpolation,
      )
      .hex() as CssColor,
    active: chroma(baseActiveInterpolColor)
      .luminance(
        getLuminanceFromLightness(calculateLightness(colorLightness, modifier * 2)),
        colorMetaData['base-active'].interpolation,
      )
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
