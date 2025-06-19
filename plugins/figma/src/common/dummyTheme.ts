import themeConfig from '@digdir/designsystemet-theme/configs/designsystemet.config.json';
import type { ColorInfo, ThemeInfo } from './store';

const THEME = themeConfig.themes.designsystemet.colors;
const MAIN_COLORS = Object.keys(THEME.main);
const SUPPORT_COLORS = Object.keys(THEME.support);
const NEUTRAL_COLOR = 'neutral';
const ALL_COLORS = [...MAIN_COLORS, ...SUPPORT_COLORS, NEUTRAL_COLOR] as const;
type ColorThemeKeys = (typeof ALL_COLORS)[number];

export type InferredColorTheme = Record<ColorThemeKeys, ThemeInfo>;

export const getDummyTheme = () => {
  return JSON.parse(JSON.stringify(dummyTheme)) as InferredColorTheme;
};

const generateColorSet = (): ColorInfo => {
  const colors = {} as ColorInfo;
  for (let i = 1; i <= 16; i++) {
    colors[i as unknown as keyof ColorInfo] = '#000000';
  }

  return colors;
};

export const dummyTheme = ALL_COLORS.reduce((obj, key) => {
  obj[key] = {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  };
  return obj;
}, {} as InferredColorTheme);
