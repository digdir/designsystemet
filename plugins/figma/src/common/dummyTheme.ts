import type { ColorInfo, ColorTheme } from './store';

export const getDummyTheme = () => {
  return JSON.parse(JSON.stringify(dummyTheme)) as ColorTheme;
};

const generateColorSet = (): ColorInfo => {
  const colors = {} as ColorInfo;
  for (let i = 1; i <= 16; i++) {
    colors[i as unknown as keyof ColorInfo] = '#000000';
  }

  return colors;
};

const dummyTheme: ColorTheme = {
  brand1: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
  brand2: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
  neutral: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
  brand3: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
  accent: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
};
