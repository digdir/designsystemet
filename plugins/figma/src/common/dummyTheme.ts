import type { ColorTheme } from './store';

export const getDummyTheme = () => {
  return JSON.parse(JSON.stringify(dummyTheme)) as ColorTheme;
};

const generateColorSet = () => {
  const colors: { [key: number]: string } = {};
  for (let i = 1; i <= 16; i++) {
    colors[i] = '#000000';
  }

  return colors;
};

const dummyTheme = {
  primary: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
  accent: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
  neutral: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
  extra1: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
  extra2: {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  },
};
