import type { CssColor } from '@/packages/cli/dist/src';

export type modeType = 'light' | 'dark' | 'contrast';
export type ThemeColors = 'accent' | 'neutral' | 'brand1' | 'brand2' | 'brand3';

export type colorType = {
  color: CssColor;
  contrast: string;
  lightness: string;
};

export type ColorsType = {
  background: { subtle: colorType; default: colorType };
  component: { normal: colorType; hover: colorType; active: colorType };
  border: { subtle: colorType; default: colorType; strong: colorType };
  solid: {
    normal: colorType;
    hover: colorType;
    active: colorType;
    contrastOne: colorType;
    contrastTwo: colorType;
  };
  text: { subtle: colorType; default: colorType };
};
