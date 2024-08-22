import type { CssColor } from '@adobe/leonardo-contrast-colors';

export type ColorMode = 'light' | 'dark' | 'contrast';
export type ContrastMode = 'aa' | 'aaa';
export type ColorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type GlobalColors = 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'yellow';
export type ThemeColors = 'accent' | 'neutral' | 'brand1' | 'brand2' | 'brand3';
export type ColorInfo = {
  hex: CssColor;
  number: ColorNumber;
  name: string;
};
export type ThemeInfo = {
  light: ColorInfo[];
  dark: ColorInfo[];
  contrast: ColorInfo[];
};
