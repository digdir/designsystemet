import chroma from 'chroma-js';
import * as R from 'ramda';
import { semanticColorSpec } from './specs.ts';
import type { ColorScale, ColorScheme, CssColor, SemanticColorSpec, ThemeInfo } from './types.ts';
import { getLightnessFromHex, getLuminanceFromLightness } from './utils.ts';

export const RESERVED_COLORS = ['neutral', 'success', 'warning', 'danger', 'info'];

type ColorScaleSpec = SemanticColorSpec;

/**
 * Generates a color scale based on a base color and a color mode.
 *
 * @param color The base color that is used to generate the color scale
 * @param colorScheme The color scheme to generate a scale for
 * @param colorScaleSpec The color scale definition to use for generating the color scale. Semantic color scale definition is used by default.
 */
export const generateColorScale = (
  color: CssColor,
  colorScheme: ColorScheme,
  colorScaleSpec: ColorScaleSpec = semanticColorSpec,
): ColorScale => {
  let interpolationColor = color;

  // Reduce saturation in dark mode for the interpolation colors
  if (colorScheme === 'dark') {
    const [L, C, H] = chroma(color).oklch();
    const chromaModifier = 0.7;
    interpolationColor = chroma(L, C * chromaModifier, H, 'oklch').hex() as CssColor;
  }

  const colors = R.mapObjIndexed((step) => {
    const luminance = step.luminance[colorScheme];
    return {
      ...step,
      hex: chroma(interpolationColor).luminance(luminance).hex() as CssColor,
    };
  }, colorScaleSpec);

  // Overwrite with modified base colors for the specified color scheme
  if (colorScaleSpec['base-default']) {
    const baseColors = generateBaseColors(color, colorScheme);
    const contrastDefault = generateContrastDefault([baseColors.default, baseColors.hover]);
    colors['base-default'] = { ...colors['base-default'], hex: baseColors.default };
    colors['base-hover'] = { ...colors['base-hover'], hex: baseColors.hover };
    colors['base-active'] = { ...colors['base-active'], hex: baseColors.active };
    colors['base-contrast-subtle'] = {
      ...colors['base-contrast-subtle'],
      hex: generateContrastSubtle(baseColors.default, contrastDefault),
    };
    colors['base-contrast-default'] = {
      ...colors['base-contrast-default'],
      hex: contrastDefault,
    };
  }

  return colors;
};

/**
 * Generates dark and light color scale schemes for a given color.
 *
 * @param color The color that is used to generate the color scale schemes
 */
export const generateColorSchemes = (color: CssColor): ThemeInfo => ({
  light: generateColorScale(color, 'light'),
  dark: generateColorScale(color, 'dark'),
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
 * Picks white or black, whichever has the best contrast against all the given colors.
 *
 * @param backgrounds The colors the contrast color is used on, e.g. base-default and base-hover
 */
const generateContrastDefault = (backgrounds: CssColor[]): CssColor => {
  const lowestContrast = (color: CssColor) => Math.min(...backgrounds.map((bg) => chroma.contrast(bg, color)));
  return lowestContrast('#ffffff') >= lowestContrast('#000000') ? '#ffffff' : '#000000';
};

/**
 * Generates a subtle contrast color for a base color, in the same direction as the default contrast color.
 *
 * @param color The base color
 * @param contrastDefault The default contrast color, white or black
 */
const generateContrastSubtle = (color: CssColor, contrastDefault: CssColor): CssColor => {
  const lightness = getLightnessFromHex(color);
  const modifier = lightness <= 40 || lightness >= 60 ? 60 : 50;
  const targetLightness = contrastDefault === '#ffffff' ? lightness + modifier : lightness - modifier;

  return chroma(color).luminance(getLuminanceFromLightness(targetLightness)).hex() as CssColor;
};
