import * as R from 'ramda';
import { baseColors, colorMetadata, dsLinkColor } from '../../../colors/colorMetadata.js';
import { generateColorScale } from '../../../colors/index.js';
import type { Color, ColorScheme } from '../../../colors/types.js';
import type { ColorOverrideSchema } from '../../../config.js';
import type { Colors, Token, TokenSet } from '../../types.js';

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
  colors: Colors,
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

  const main = R.mapObjIndexed(
    (color, colorName) => generateColor(generateColorScale(color, colorScheme), createColorOverrides(colorName)),
    colors.main,
  );

  const support = R.mapObjIndexed(
    (color, colorName) => generateColor(generateColorScale(color, colorScheme), createColorOverrides(colorName)),
    colors.support,
  );

  const neutralColorScale = generateColorScale(colors.neutral, colorScheme);
  const neutral = generateColor(neutralColorScale, createColorOverrides('neutral'));

  const baseColorsWithOverrides = {
    ...baseColors,
    ...overrides?.severity,
  };

  const globalColors = R.mapObjIndexed(
    (color, colorName) => generateColor(generateColorScale(color, colorScheme), createColorOverrides(colorName)),
    baseColorsWithOverrides,
  );

  const linkColor = generateColor(generateColorScale(dsLinkColor, colorScheme));
  const defaultLinkVisited = linkColor[12];
  const linkOverride: Token | undefined = overrides?.linkVisited?.[colorScheme as 'light' | 'dark']
    ? ({ $type: 'color', $value: overrides.linkVisited[colorScheme as 'light' | 'dark'] } as Token)
    : undefined;

  /* Default focus-inner is position 1 (background-default), focus-outer is position 11 (text-default) */
  const defaultFocusInner = neutralColorScale[0].hex;
  const defaultFocusOuter = neutralColorScale[10].hex;

  const focusInnerOverride = overrides?.focus?.inner?.[colorScheme as 'light' | 'dark'];
  const focusOuterOverride = overrides?.focus?.outer?.[colorScheme as 'light' | 'dark'];

  return {
    [themeName]: {
      ...main,
      ...support,
      neutral,
      ...globalColors,
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
