import * as R from 'ramda';
import { baseColors, generateColorScale } from '../../../colors/index.js';
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
  const main = R.map((color) => generateColor(generateColorScale(color, colorScheme)), colors.main);
  const support = R.map((color) => generateColor(generateColorScale(color, colorScheme)), colors.support);
  const neutral = generateColor(generateColorScale(colors.neutral, colorScheme));

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
