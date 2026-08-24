import * as R from 'ramda';
import type { ColorScale, ColorScheme, CssColor, SemanticColorNames } from '../../../../colors/index.ts';
import { generateColorScale, semanticColorSpec } from '../../../../colors/index.ts';
import { visitedLinkColor } from '../../../../schemas/defaults.ts';
import type { ColorOverrideSchema } from '../../../../schemas/v1.1/schema.ts';
import type { Token, TokenSet } from '../../../types.ts';

/*
 Group colors by color scheme, returning a record of color scales for the specified scheme.
*/
export const groupByScheme = (
  colors: Record<string, Record<string, Record<string, CssColor>>>,
  colorScheme: ColorScheme,
): Record<string, Partial<ColorScale>> =>
  R.map(
    (tokens: Record<string, Record<string, CssColor>>) =>
      R.mapObjIndexed(
        (schemes: Record<string, CssColor>, tokenName) => ({
          hex: schemes[colorScheme],
          ...semanticColorSpec[tokenName as SemanticColorNames],
        }),
        R.filter((schemes: Record<string, CssColor>) => colorScheme in schemes, tokens),
      ),
    colors,
  );

const toColorTokens = (colorScale: ColorScale): TokenSet => {
  const obj: TokenSet = {};
  for (const color of Object.values(colorScale)) {
    obj[color.number] = {
      $type: 'color',
      $value: color.hex,
    };
  }
  return obj;
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
  // Merge severity overrides as they are hex values and not color scales, so they need to be merged with the base colors before generating the color scales
  const colorsWithSeverityOverrides: Record<string, CssColor> = R.mergeRight(colors, overrides?.severity || {});

  // Group color overrides by color scheme as they are color scales and need to be merged with the generated color scales after they are generated
  const colorOverrides = groupByScheme(overrides?.colors || {}, colorScheme);

  // Generate color scales for each color in the colors object, applying any overrides if they exist
  const colorScales = R.mapObjIndexed((color: CssColor, colorName: string) => {
    let colorScale = generateColorScale(color, colorScheme);
    const colorOverride = colorOverrides[colorName];

    if (colorOverride) {
      colorScale = R.mergeDeepRight(colorScale, colorOverride);
    }
    return colorScale;
  }, colorsWithSeverityOverrides);

  // Generate the visited link color scale and apply any overrides if they exist
  const visitedLinkColorScale = generateColorScale(visitedLinkColor, colorScheme);
  const defaultLinkVisitedToken = visitedLinkColorScale['base-default'].hex;
  const linkOverride = overrides?.linkVisited?.[colorScheme as ColorScheme];

  const defaultFocusInner = colorScales.neutral['background-default'].hex;
  const defaultFocusOuter = colorScales.neutral['text-default'].hex;

  const focusInnerOverride = overrides?.focus?.inner?.[colorScheme as ColorScheme];
  const focusOuterOverride = overrides?.focus?.outer?.[colorScheme as ColorScheme];

  return {
    [themeName]: {
      ...R.map(toColorTokens, colorScales),
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
