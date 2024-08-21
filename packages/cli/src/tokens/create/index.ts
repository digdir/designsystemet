import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { baseColors, generateScaleForColor } from '../../colors';
import type { ColorInfo, ColorMode, ThemeColors } from '../../colors';

type Colors = Record<ThemeColors, CssColor>;

const generateJsonForColor = (colorArray: ColorInfo[]) => {
  const obj: { [key: string]: { $value: string; $type: string } } = {};
  for (let i = 0; i < colorArray.length; i++) {
    if (i === 13 && colorArray.length >= 14) {
      obj['contrast-1'] = {
        $value: colorArray[i].hex,
        $type: 'color',
      };
    } else if (i === 14 && colorArray.length >= 15) {
      obj['contrast-2'] = {
        $value: colorArray[i].hex,
        $type: 'color',
      };
    } else {
      obj[i + 1] = { $value: colorArray[i].hex, $type: 'color' };
    }
  }
  return obj;
};

const genereateGlobalsJson = (theme: ColorMode) => {
  const blueScale = generateScaleForColor(baseColors.blue, theme);
  const greenScale = generateScaleForColor(baseColors.green, theme);
  const orangeScale = generateScaleForColor(baseColors.orange, theme);
  const purpleScale = generateScaleForColor(baseColors.purple, theme);
  const redScale = generateScaleForColor(baseColors.red, theme);
  const yellowScale = generateScaleForColor(baseColors.yellow, theme);

  const obj = {
    global: {
      blue: generateJsonForColor(blueScale),
      green: generateJsonForColor(greenScale),
      orange: generateJsonForColor(orangeScale),
      purple: generateJsonForColor(purpleScale),
      red: generateJsonForColor(redScale),
      yellow: generateJsonForColor(yellowScale),
    },
  };

  const json = JSON.stringify(obj, null, '\t');
};

const run = ({ colors }: { colors: Colors }) => {
  const generateThemeJson = (theme: ColorMode) => {
    const accentColors = generateScaleForColor(colors.accent, theme);
    const neutralColors = generateScaleForColor(colors.neutral, theme);
    const brand1Colors = generateScaleForColor(colors.brand1, theme);
    const brand2Colors = generateScaleForColor(colors.brand2, theme);
    const brand3Colors = generateScaleForColor(colors.brand3, theme);

    const obj = {
      theme: {
        accent: generateJsonForColor(accentColors),
        neutral: generateJsonForColor(neutralColors),
        brand1: generateJsonForColor(brand1Colors),
        brand2: generateJsonForColor(brand2Colors),
        brand3: generateJsonForColor(brand3Colors),
      },
    };

    return JSON.stringify(obj, null, '\t');
  };
};
