import themeConfig from '@digdir/designsystemet-theme/configs/designsystemet.config.json';
import type { ColorInfo, ThemeInfo } from './store';

const THEME = themeConfig.themes.designsystemet.colors;
const NEUTRAL_COLOR = 'neutral';

export const REQUIRED_COLORS = [
  ...Object.keys(THEME.main),
  ...Object.keys(THEME.support),
  NEUTRAL_COLOR,
] as const;

type ColorThemeKeys = (typeof REQUIRED_COLORS)[number];

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

export const dummyTheme = REQUIRED_COLORS.reduce((obj, key) => {
  obj[key] = {
    light: generateColorSet(),
    dark: generateColorSet(),
    contrast: generateColorSet(),
  };
  return obj;
}, {} as InferredColorTheme);
