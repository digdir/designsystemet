import * as R from 'ramda';
import { baseColors, colorMetadata, generateColorScale } from '../../../colors/index.js';
import type { Color, ColorScheme } from '../../../colors/types.js';

import type { Colors, TokenSet } from '../../types.js';

const generateColor = (colorArray: Color[]): TokenSet => {
  const obj: TokenSet = {};
  const $type = 'color';
  for (const index in colorArray) {
    obj[Number(index) + 1] = { $type, $value: colorArray[index].hex };
  }
  return obj;
};

export const generateColorScheme = (themeName: string, colorScheme: ColorScheme, colors: Colors): TokenSet => {
  const main = R.map((color) => generateColor(generateColorScale(color, colorScheme, colorMetadata)), colors.main);
  const support = R.map(
    (color) => generateColor(generateColorScale(color, colorScheme, colorMetadata)),
    colors.support,
  );
  const neutral = generateColor(generateColorScale(colors.neutral, colorScheme, colorMetadata));

  return {
    [themeName]: {
      ...main,
      ...support,
      neutral,
    },
  };
};

export const generateColorGlobal = (colorScheme: ColorScheme): TokenSet => {
  const blueScale = generateColorScale(baseColors.blue, colorScheme, colorMetadata);
  const greenScale = generateColorScale(baseColors.green, colorScheme, colorMetadata);
  const orangeScale = generateColorScale(baseColors.orange, colorScheme, colorMetadata);
  const purpleScale = generateColorScale(baseColors.purple, colorScheme, colorMetadata);
  const redScale = generateColorScale(baseColors.red, colorScheme, colorMetadata);

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
