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

  const colorScales: Record<string, TokenSet> = R.mapObjIndexed((color: CssColor, colorName: string) => {
    let colorScale = generateColorScale(color, colorScheme);
    const colorOverride = colorOverrides[colorName];

    if (colorOverride) {
      colorScale = R.mergeDeepRight(colorScale, colorOverride);
    }
    return toColorTokens(colorScale);
  }, colorsWithSeverityOverrides);

  const visitedLinkColorScale = toColorTokens(generateColorScale(visitedLinkColor, colorScheme)); // generate the visited link color scale for light and dark mode
  const defaultLinkVisited = visitedLinkColorScale[12];
  const linkOverride: Token | undefined = overrides?.linkVisited?.[colorScheme as 'light' | 'dark']
    ? ({ $type: 'color', $value: overrides.linkVisited[colorScheme as 'light' | 'dark'] } as Token)
    : undefined;

  /* Default focus-inner is position 1 (background-default), focus-outer is position 11 (text-default) */
  const defaultFocusInner = colorScales.neutral[1].$value;
  const defaultFocusOuter = colorScales.neutral[11].$value;

  const focusInnerOverride = overrides?.focus?.inner?.[colorScheme as 'light' | 'dark'];
  const focusOuterOverride = overrides?.focus?.outer?.[colorScheme as 'light' | 'dark'];

  return {
    [themeName]: {
      ...colorScales,
      link: {
        visited: linkOverride || defaultLinkVisited,
      },
      focus: {
        inner: {
          $type: 'color',
          $value: focusInnerOverride || defaultFocusInner,
        } as Token,
        outer: {
          $type: 'color',
          $value: focusOuterOverride || defaultFocusOuter,
        } as Token,
      },
    },
  };
};
