import type { ColorScale, ColorScheme, CssColor } from '../../../../colors/index.ts';
import { generateColorScale, semanticColorNames, semanticColorSpec } from '../../../../colors/index.ts';
import { visitedLinkColor } from '../../../../schemas/defaults.ts';
import type { ColorOverrideSchema } from '../../../../schemas/v1.1/schema.ts';
import type { Token, TokenSet } from '../../../types.ts';

/**
 * Group colors by color scheme, returning a partial record of color scales for the specified scheme.
 *
 * @param colors - A record of color scales, where each color scale is a record of color schemes and their corresponding hex values.
 * @param colorScheme - The color scheme to group the colors by.
 * @returns A record of color scales for the specified color scheme.
 */
export const groupByScheme = (
  colors: Record<string, Record<string, Record<string, CssColor>>>,
  colorScheme: ColorScheme,
) => {
  const grouped: Record<string, Partial<ColorScale>> = {};
  for (const [colorName, overrides] of Object.entries(colors)) {
    const overridesForScheme: Partial<ColorScale> = {};

    for (const tokenName of semanticColorNames) {
      const hex = overrides[tokenName]?.[colorScheme];
      if (hex) {
        overridesForScheme[tokenName] = { ...semanticColorSpec[tokenName], hex };
      }
    }

    grouped[colorName] = overridesForScheme;
  }

  return grouped;
};

const toTokenSet = (colorScale: ColorScale): TokenSet => {
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
  const colorsWithSeverityOverrides = { ...colors, ...overrides?.severity };

  const colorOverrides = groupByScheme(overrides?.colors ?? {}, colorScheme);
  const colorScales: Record<string, ColorScale> = {};

  for (const [colorName, color] of Object.entries(colorsWithSeverityOverrides)) {
    colorScales[colorName] = {
      ...generateColorScale(color, colorScheme),
      ...colorOverrides[colorName],
    };
  }

  const defaultVisitedLink = generateColorScale(visitedLinkColor, colorScheme)['base-default'].hex;
  const visitedLinkOverride = overrides?.linkVisited?.[colorScheme];

  const defaultFocusInner = colorScales.neutral['background-default'].hex;
  const defaultFocusOuter = colorScales.neutral['text-default'].hex;

  const focusInnerOverride = overrides?.focus?.inner?.[colorScheme];
  const focusOuterOverride = overrides?.focus?.outer?.[colorScheme];

  return {
    [themeName]: {
      ...Object.fromEntries(Object.entries(colorScales).map(([name, scale]) => [name, toTokenSet(scale)])),
      link: {
        visited: toColorToken(visitedLinkOverride || defaultVisitedLink),
      },
      focus: {
        inner: toColorToken(focusInnerOverride || defaultFocusInner),
        outer: toColorToken(focusOuterOverride || defaultFocusOuter),
      },
    },
  };
};
