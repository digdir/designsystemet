import * as R from 'ramda';
import { baseColors, generateColorScale } from '../../../colors/index.js';
import type { Color, ColorScheme } from '../../../colors/types.js';
import type { ColorOverrideSchema } from '../../../config.js';
import type { Colors, TokenSet } from '../../types.js';
import { SEMANTIC_TOKEN_TO_SCALE_POSITION } from '../semantic-mapping.js';

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
  // Create override mappings for each color
  const createColorOverrides = (colorName: string) => {
    if (!overrides?.colors || !(colorName in overrides.colors)) {
      return undefined;
    }

    const colorOverrides = overrides.colors[colorName];
    const positionOverrides: Record<number, string> = {};

    // Map semantic token names to color scale positions
    Object.entries(colorOverrides).forEach(([semanticTokenName, modeOverrides]) => {
      const position = SEMANTIC_TOKEN_TO_SCALE_POSITION[semanticTokenName];
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

  const neutral = generateColor(generateColorScale(colors.neutral, colorScheme), createColorOverrides('neutral'));

  return {
    [themeName]: {
      ...main,
      ...support,
      neutral,
    },
  };
};

export const generateColorGlobal = (colorScheme: ColorScheme): TokenSet => {
  const blueScale = generateColorScale(baseColors.blue, colorScheme);
  const greenScale = generateColorScale(baseColors.green, colorScheme);
  const orangeScale = generateColorScale(baseColors.orange, colorScheme);
  const purpleScale = generateColorScale(baseColors.purple, colorScheme);
  const redScale = generateColorScale(baseColors.red, colorScheme);

  return {
    global: {
      blue: generateColor(blueScale),
      green: generateColor(greenScale),
      orange: generateColor(orangeScale),
      purple: generateColor(purpleScale),
      red: generateColor(redScale),
    },
  };
};
