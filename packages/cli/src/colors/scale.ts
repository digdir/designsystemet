import chroma from 'chroma-js';
import * as R from 'ramda';
import { semanticColorSpec } from './specs.ts';
import type {
  ChromaAdjustment,
  ColorScale,
  ColorScheme,
  CssColor,
  SemanticColorNames,
  SemanticColorSpec,
  ThemeInfo,
} from './types.ts';
import { getLightnessFromHex, getLuminanceFromLightness } from './utils.ts';

export const RESERVED_COLORS = ['success', 'warning', 'danger', 'info'];

/** Fixed red used for the invalid steps. Same as the default severity color for danger. */
const INVALID_BASE_COLOR: CssColor = '#C01B1B';

type InvalidColorNames = Extract<SemanticColorNames, 'text-invalid' | 'surface-invalid'>;

const invalidColorNames: InvalidColorNames[] = ['surface-invalid', 'text-invalid'];

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
  const interpolationColor = getInterpolationColor(color, colorScheme);

  const colors = R.mapObjIndexed((step) => {
    const luminance = step.luminance[colorScheme];
    const hex = chroma(interpolationColor).luminance(luminance).hex() as CssColor;
    return {
      ...step,
      hex: step.chroma ? adjustChroma(hex, step.chroma, colorScheme) : hex,
    };
  }, colorScaleSpec);

  // Overwrite with modified base colors for the specified color scheme
  if (colorScaleSpec['base-default']) {
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

    // Invalid steps stay red in every scale: luminance from the spec, hue from a fixed red.
    const invalidInterpolationColor = getInterpolationColor(INVALID_BASE_COLOR, colorScheme);
    for (const name of invalidColorNames) {
      const luminance = colorScaleSpec[name].luminance[colorScheme];
      colors[name] = { ...colors[name], hex: chroma(invalidInterpolationColor).luminance(luminance).hex() as CssColor };
    }
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
 * Generates contrast color for given color
 *
 * @param color color
 * @param type 'default' | 'subtle'
 */
const generateColorContrast = (color: CssColor, type: 'default' | 'subtle'): CssColor => {
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
 * Scales the chroma of a color while keeping its luminance, so contrast is unchanged.
 *
 * @param hex The color to adjust
 * @param adjustment Chroma factor per color scheme, and an optional upper limit
 * @param colorScheme The color scheme the color is generated for
 */
const adjustChroma = (hex: CssColor, adjustment: ChromaAdjustment, colorScheme: ColorScheme): CssColor => {
  const [L, C, H] = chroma(hex).oklch();
  const chromaValue = Number.isNaN(C) ? 0 : C;
  const target = Math.min(chromaValue * adjustment.factor[colorScheme], adjustment.max ?? Number.POSITIVE_INFINITY);
  const adjusted = chroma(L, target, Number.isNaN(H) ? 0 : H, 'oklch').hex();
  // Re-fit luminance so contrast is identical to the unadjusted step.
  return chroma(adjusted).luminance(chroma(hex).luminance()).hex() as CssColor;
};

/** Returns the color used for luminance interpolation. Saturation is reduced in dark mode. */
function getInterpolationColor(color: CssColor, colorScheme: ColorScheme): CssColor {
  if (colorScheme !== 'dark') return color;
  const [L, C, H] = chroma(color).oklch();
  const chromaModifier = 0.7;
  return chroma(L, C * chromaModifier, H, 'oklch').hex() as CssColor;
}
