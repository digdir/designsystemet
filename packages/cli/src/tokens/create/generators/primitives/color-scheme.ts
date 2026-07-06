import * as R from 'ramda';
import { baseColors, colorMetadata, dsLinkColor } from '../../../../colors/colorMetadata.ts';
import { generateColorScale } from '../../../../colors/index.ts';
import type { Color, ColorScheme, CssColor } from '../../../../colors/types.ts';
import type { ColorOverrideSchema } from '../../../../schemas/v1.1/schema.ts';
import type { Token, TokenSet } from '../../../types.ts';

const generateColor = (colorArray: Color[], overrides?: Record<number, string>): TokenSet => {
  const obj: TokenSet = {};
  const $type = 'color';
  for (const index in colorArray) {
    const position = Number(index) + 1;
    const overrideValue = overrides?.[position];
    obj[position] = {
      $type,
      $value: overrideValue || colorArray[index].hex,
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
  /* Create override mappings for each color */
  const createColorOverrides = (colorName: string) => {
    if (!overrides?.colors || !(colorName in overrides.colors)) {
      return undefined;
    }

    const colorOverrides = overrides.colors[colorName];
    const positionOverrides: Record<number, string> = {};

    // Map semantic token names to color scale positions
    Object.entries(colorOverrides).forEach(([semanticTokenName, modeOverrides]) => {
      const position = colorMetadata[semanticTokenName as keyof typeof colorMetadata].number;
      if (position) {
        let overrideValue: string | undefined;

        if (colorScheme === 'light' && modeOverrides.light) {
          overrideValue = modeOverrides.light;
        } else if (colorScheme === 'dark' && modeOverrides.dark) {
          overrideValue = modeOverrides.dark;
        }

        if (overrideValue) {
          positionOverrides[position] = overrideValue;
        }
      }
    });

    return Object.keys(positionOverrides).length > 0 ? positionOverrides : undefined;
  };

  const colorScales = R.mapObjIndexed((color, colorName) => {
    if (colorName === 'neutral') {
      const neutralColorScale = generateColorScale(colors.neutral, colorScheme);
      return generateColor(neutralColorScale, createColorOverrides('neutral'));
    }

    return generateColor(generateColorScale(color, colorScheme), createColorOverrides(colorName));
  }, colors);

  const baseColorsWithOverrides = {
    ...baseColors,
    ...overrides?.severity,
  };

  const severityColors = R.mapObjIndexed(
    (color, colorName) => generateColor(generateColorScale(color, colorScheme), createColorOverrides(colorName)),
    baseColorsWithOverrides,
  );

  const linkColor = generateColor(generateColorScale(dsLinkColor, colorScheme));
  const defaultLinkVisited = linkColor[12];
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
      ...severityColors,
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
