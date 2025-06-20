import type { ColorInfo } from './store';
import { type ColorTheme, REQUIRED_COLORS } from './utils';

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

export const dummyTheme = REQUIRED_COLORS.reduce((obj, key) => {
  obj[key] = {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  };
  return obj;
}, {} as ColorTheme);
