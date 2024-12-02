import type { Colors } from '../tokens/types';

export type ColorMode = 'light' | 'dark' | 'contrast';
export type ContrastMode = 'aa' | 'aaa';
export type ColorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
export type GlobalColors = 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'yellow';
export type ColorError = 'none' | 'decorative' | 'interaction';

export type ColorInfo = {
  hex: string;
  number: ColorNumber;
  name: string;
};

export type ThemeInfo = {
  light: ColorInfo[];
  dark: ColorInfo[];
  contrast: ColorInfo[];
};

export type GeneratedColorTheme = {
  main: Record<string, ThemeInfo>;
  support: Record<string, ThemeInfo>;
  neutral: ThemeInfo;
};

export type ThemeGenType = {
  colors: Colors;
  contrastMode?: ContrastMode;
};
