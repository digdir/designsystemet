import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { CssColor } from '@adobe/leonardo-contrast-colors';

import type { ColorInfoType, ThemeType } from './utils/themeUtils';
import { Settings } from './settings';

type StoreThemeType = {
  theme: ThemeType;
  color: CssColor;
};

type ColorStore = {
  accentTheme: StoreThemeType;
  neutralTheme: StoreThemeType;
  brandOneTheme: StoreThemeType;
  brandTwoTheme: StoreThemeType;
  brandThreeTheme: StoreThemeType;
  setAccentTheme: (theme: ThemeType, color: CssColor) => void;
  setNeutralTheme: (theme: ThemeType, color: CssColor) => void;
  setBrandOneTheme: (theme: ThemeType, color: CssColor) => void;
  setBrandTwoTheme: (theme: ThemeType, color: CssColor) => void;
  setBrandThreeTheme: (theme: ThemeType, color: CssColor) => void;
  selectedColor: ColorInfoType;
  setSelectedColor: (color: ColorInfoType) => void;
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
      hex: '#ffffff',
      number: 1,
      name: 'Default',
    },
    setSelectedColor: (color) => set({ selectedColor: color }),
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
