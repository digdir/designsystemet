import type { ColorScale, ColorScheme, CssColor } from '../../../../colors/index.ts';
import { generateColorScale, getThemeColorScales } from '../../../../colors/index.ts';
import { visitedLinkColor } from '../../../../schemas/defaults.ts';
import type { ColorOverrideSchema } from '../../../../schemas/v1.1/schema.ts';
import type { Token, TokenSet } from '../../../types.ts';

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
