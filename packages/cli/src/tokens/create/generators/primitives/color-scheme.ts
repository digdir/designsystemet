import type { ColorScale, ColorScheme, CssColor, SemanticColorNames, ThemeInfo } from '../../../../colors/index.ts';
import { convertToHex, generateColorScale, semanticColorSpec } from '../../../../colors/index.ts';
import type { ColorOverrideSchema, ColorOverrideSchemaInput } from '../../../../schemas/schema-overrides.ts';
import type { Token, TokenSet } from '../../../types.ts';

/**
 * Group colors by color scheme, returning a partial record of color scales for the specified scheme.
 *
 * @param colors - A record of color scales, where each color scale is a record of color schemes and their corresponding hex values.
 * @param colorScheme - The color scheme to group the colors by.
 * @returns A record of color scales for the specified color scheme.
 */
export const groupByScheme = (
  colors: Record<string, Partial<Record<SemanticColorNames, Partial<Record<ColorScheme, CssColor>>>>>,
  colorScheme: ColorScheme,
) => {
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
 * Resolves every color scale of a theme for one color scheme: the theme's colors, with
 * `overrides.severity` and `overrides.colors` applied. Only the colors in the theme are resolved,
 * so the default severity colors are included when the theme comes from a validated config.
 *
 * This is what the token generator turns into color-scheme tokens.
 */
export const getThemeColorScales = (
  theme: { colors: Record<string, CssColor>; overrides?: ColorOverrideSchema },
  colorScheme: ColorScheme,
): Record<string, ColorScale> => {
  const { overrides } = theme;
  const colors: Record<string, CssColor> = { ...theme.colors, ...(overrides?.severity || {}) };

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

/**
 * Resolves every color of a theme in light and dark mode, see `getThemeColorScales`.
 *
 * Takes a theme as it is written in a config, so previews (e.g. the theme builder) can show
 * the colors of a config they are editing. Nothing is validated or added: only the colors the
 * theme lists are resolved (no default severity colors), and a value that is not a color throws.
 * Base colors are made six-digit hex first, as the config schema does, so `#abc` gives the scale of `#aabbcc`. Validate with the config schema first when that matters.
 */
export const getThemeColorSchemes = (theme: {
  colors: Record<string, string>;
  overrides?: ColorOverrideSchemaInput;
}): Record<string, ThemeInfo> => {
  const toHex = (colors: Record<string, string>) =>
    Object.fromEntries(Object.entries(colors).map(([name, color]) => [name, convertToHex(color)]));
  const { severity, ...overrides } = theme.overrides ?? {};
  const resolved = {
    colors: toHex(theme.colors),
    overrides: { ...overrides, ...(severity && { severity: toHex(severity) }) },
  } as Parameters<typeof getThemeColorScales>[0];
  const light = getThemeColorScales(resolved, 'light');
  const dark = getThemeColorScales(resolved, 'dark');

  return Object.fromEntries(Object.keys(light).map((name) => [name, { light: light[name], dark: dark[name] }]));
};

const toColorNumberTokens = (colorScale: ColorScale): TokenSet => {
  const tokens: TokenSet = {};

  for (const color of Object.values(colorScale)) {
    tokens[color.number] = {
      $type: 'color',
      $value: color.hex,
    };
  }

  return tokens;
};

const toColorToken = (color: CssColor): Token => ({
  $type: 'color',
  $value: color,
});

export const generateColorScheme = (
  themeName: string,
  colorScheme: ColorScheme,
  colors: Record<string, CssColor>,
  overrides?: ColorOverrideSchema,
): TokenSet => {
  const colorScales = getThemeColorScales({ colors, overrides }, colorScheme);

  const defaultFocusInner = colorScales.neutral['background-default'].hex;
  const defaultFocusOuter = colorScales.neutral['text-default'].hex;

  const focusInnerOverride = overrides?.focus?.inner?.[colorScheme];
  const focusOuterOverride = overrides?.focus?.outer?.[colorScheme];

  const colorNumberTokens: Record<string, TokenSet> = {};
  for (const [colorName, colorScale] of Object.entries(colorScales)) {
    colorNumberTokens[colorName] = toColorNumberTokens(colorScale);
  }

  return {
    [themeName]: {
      ...colorNumberTokens,
      focus: {
        inner: toColorToken(focusInnerOverride || defaultFocusInner),
        outer: toColorToken(focusOuterOverride || defaultFocusOuter),
      },
    },
  };
};
