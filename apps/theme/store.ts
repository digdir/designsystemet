import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { CssColor } from '@adobe/leonardo-contrast-colors';
import type {
  ColorInfo,
  ColorType,
  ThemeInfo,
} from '@digdir/designsystemet/color';

import { Settings } from './settings';

type StoreThemeType = {
  theme: ThemeInfo;
  color: CssColor;
};

type ColorStore = {
  accentTheme: StoreThemeType;
  neutralTheme: StoreThemeType;
  brandOneTheme: StoreThemeType;
  brandTwoTheme: StoreThemeType;
  brandThreeTheme: StoreThemeType;
  setAccentTheme: (theme: ThemeInfo, color: CssColor) => void;
  setNeutralTheme: (theme: ThemeInfo, color: CssColor) => void;
  setBrandOneTheme: (theme: ThemeInfo, color: CssColor) => void;
  setBrandTwoTheme: (theme: ThemeInfo, color: CssColor) => void;
  setBrandThreeTheme: (theme: ThemeInfo, color: CssColor) => void;
  selectedColor: { color: ColorInfo; type: string };
  setSelectedColor: (color: ColorInfo, type: ColorType) => void;
};

const defaultTheme = () => {
  return {
    light: [],
    dark: [],
    contrast: [],
  };
};

export const useThemeStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    accentTheme: {
      theme: defaultTheme(),
      color: Settings.accentBaseColor,
    },
    neutralTheme: {
      theme: defaultTheme(),
      color: Settings.neutralBaseColor,
    },
    brandOneTheme: {
      theme: defaultTheme(),
      color: Settings.brand1BaseColor,
    },
    brandTwoTheme: {
      theme: defaultTheme(),
      color: Settings.brand2BaseColor,
    },
    brandThreeTheme: {
      theme: defaultTheme(),
      color: Settings.brand3BaseColor,
    },
    selectedColor: {
      color: {
        hex: '#ffffff',
        number: 1,
        name: 'Default',
      },
      type: '',
    },
    setSelectedColor: (color, type) =>
      set({ selectedColor: { color: color, type: type } }),
    setAccentTheme: (theme, color) => set({ accentTheme: { theme, color } }),
    setNeutralTheme: (theme, color) => set({ neutralTheme: { theme, color } }),
    setBrandOneTheme: (theme, color) =>
      set({ brandOneTheme: { theme, color } }),
    setBrandTwoTheme: (theme, color) =>
      set({ brandTwoTheme: { theme, color } }),
    setBrandThreeTheme: (theme, color) =>
      set({ brandThreeTheme: { theme, color } }),
  })),
);
