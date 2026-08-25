import * as R from 'ramda';
import type { ColorScale, ColorScheme, CssColor, SemanticColorNames } from '../../../../colors/index.ts';
import { generateColorScale, semanticColorSpec } from '../../../../colors/index.ts';
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
  const colorsWithSeverityOverrides: Record<string, CssColor> = { ...colors, ...(overrides?.severity || {}) };

  const colorOverrides = groupByScheme(overrides?.colors || {}, colorScheme);

  const colorScales: Record<string, ColorScale> = {};

  for (const [colorName, color] of Object.entries(colorsWithSeverityOverrides)) {
    let colorScale = generateColorScale(color, colorScheme);
    const colorOverride = colorOverrides[colorName];

    if (colorOverride) {
      colorScale = R.mergeDeepRight(colorScale, colorOverride);
    }
    colorScales[colorName] = colorScale;
  }

  const defaultLinkVisitedToken = generateColorScale(visitedLinkColor, colorScheme)['base-default'].hex;
  const linkOverride = overrides?.linkVisited?.[colorScheme];

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
      link: {
        visited: toColorToken(linkOverride || defaultLinkVisitedToken),
      },
      focus: {
        inner: toColorToken(focusInnerOverride || defaultFocusInner),
        outer: toColorToken(focusOuterOverride || defaultFocusOuter),
      },
    },
  };
};
