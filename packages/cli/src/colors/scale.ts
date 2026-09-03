import chroma from 'chroma-js';
import * as R from 'ramda';
import { severityColors } from '../schemas/defaults.ts';
import { getSemanticColorByNumber, semanticColorSpec } from './specs.ts';
import type {
  ColorNumber,
  ColorScale,
  ColorScheme,
  CssColor,
  SemanticColorNames,
  SemanticColorSpec,
  SeverityColorNames,
  ThemeInfo,
} from './types.ts';
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
 * Returns the css variable for a color.
 * TODO: deprecate this
 * @param colorType The type of color
 * @param colorNumber The number of the color
 */
export const getCssVariable = (colorType: string, colorNumber: ColorNumber) => {
  return `--ds-color-${colorType}-${getSemanticColorByNumber(colorNumber).displayName.toLowerCase().replace(/\s/g, '-')}`;
};

/** Non-severity colors first (in user order), then all severity colors at the end in severityColors order.
 * User-defined severity colors keep their value but are moved to the end.
 *
 * We do this because we want severity colors to always be last when design-tokens are visualized in Token Studio and Figma Variables.
 */
export function addSeverityColors(colors: Record<string, CssColor>): Record<string, CssColor> {
  const result = new Map(Object.entries(colors));
  for (const [name, value] of Object.entries(severityColors)) {
    const userValue = result.get(name);
    result.delete(name); // Deleting and re-adding moves the key to the end
    result.set(name, userValue ?? value);
  }
  return Object.fromEntries(result);
}

/** Per-color, per-scheme hex overrides for individual steps of a generated color scale. */
export type ColorScaleOverrides = Record<
  string,
  Partial<Record<SemanticColorNames, Partial<Record<ColorScheme, CssColor>>>>
>;

/** The color-related overrides of a theme config. */
export type ThemeColorOverrides = {
  colors?: ColorScaleOverrides;
  severity?: Partial<Record<SeverityColorNames, CssColor>>;
};

/**
 * Group colors by color scheme, returning a partial record of color scales for the specified scheme.
 *
 * @param colors - A record of color scales, where each color scale is a record of color schemes and their corresponding hex values.
 * @param colorScheme - The color scheme to group the colors by.
 * @returns A record of color scales for the specified color scheme.
 */
export const groupByScheme = (colors: ColorScaleOverrides, colorScheme: ColorScheme) => {
  const grouped: Record<string, Partial<ColorScale>> = {};
  for (const [colorName, customColorScale] of Object.entries(colors)) {
    const schemeColors: Partial<ColorScale> = {};

    for (const semanticColorName of Object.keys(customColorScale) as SemanticColorNames[]) {
      const hex = customColorScale[semanticColorName]?.[colorScheme];
      if (hex) {
        schemeColors[semanticColorName] = { hex, ...semanticColorSpec[semanticColorName] };
      }
    }
    grouped[colorName] = schemeColors;
  }

  return grouped;
};

/**
 * Resolves every color scale of a theme for one color scheme: the theme's colors plus the
 * default severity colors, with `overrides.severity` and `overrides.colors` applied.
 *
 * This is what the token generator turns into color-scheme tokens; previews (e.g. the Figma
 * plugin) use it directly so they show the same colors the tokens end up with.
 */
export const getThemeColorScales = (
  theme: { colors: Record<string, CssColor>; overrides?: ThemeColorOverrides },
  colorScheme: ColorScheme,
): Record<string, ColorScale> => {
  const { overrides } = theme;
  const colors: Record<string, CssColor> = { ...addSeverityColors(theme.colors), ...(overrides?.severity || {}) };

  const colorOverrides = groupByScheme(overrides?.colors || {}, colorScheme);

  const colorScales: Record<string, ColorScale> = {};

  for (const [colorName, color] of Object.entries(colors)) {
    let colorScale = generateColorScale(color, colorScheme);
    const colorOverride = colorOverrides[colorName];

    if (colorOverride) {
      colorScale = { ...colorScale, ...colorOverride };
    }
    colorScales[colorName] = colorScale;
  }

  return colorScales;
};
