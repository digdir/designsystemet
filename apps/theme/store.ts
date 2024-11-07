import type {
  ColorInfo,
  ThemeColors,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type ColorTheme = {
  name: string;
  colors: ThemeInfo;
};

type ColorStore = {
  mainColors: ColorTheme[];
  supportColors: ColorTheme[];
  neutralColor: ColorTheme;
  addMainColor: (newColorTheme: ColorTheme) => void;
  updateMainColor: (newColorTheme: ColorTheme, index: number) => void;
  setMainColors: (colors: ColorTheme[]) => void;
  setSupportColors: (colors: ColorTheme[]) => void;
  setNeutralColor: (color: ColorTheme) => void;
  selectedColor: { color: ColorInfo; type: ThemeColors };
  setSelectedColor: (color: ColorInfo, type: ThemeColors) => void;
  borderRadius: string;
  setBorderRadius: (radius: string) => void;
  appearance: 'light' | 'dark';
  setAppearance: (appearance: 'light' | 'dark') => void;
  themePreview: 'one' | 'two' | 'three';
  setThemePreview: (theme: 'one' | 'two' | 'three') => void;
};

export const useThemeStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    selectedColor: {
      color: {
        hex: '#ffffff',
        number: 1,
        name: 'Default',
      },
      type: 'accent',
    },
    borderRadius: '0.25rem',
    appearance: 'light',
    themePreview: 'one',
    mainColors: [],
    addMainColor: (newColorTheme) =>
      set((state) => ({
        mainColors: [...state.mainColors, newColorTheme],
      })),
    updateMainColor: (updatedItem, index) =>
      set((state) => {
        state.mainColors[index] = updatedItem;
        return { mainColors: state.mainColors };
      }),
    setMainColors: (colors) => set({ mainColors: colors }),
    supportColors: [],
    setSupportColors: (colors) => set({ supportColors: colors }),
    neutralColor: {
      name: 'Default',
      colors: {
        light: [],
        dark: [],
        contrast: [],
      },
    },
    setNeutralColor: (color) => set({ neutralColor: color }),
    setAppearance: (appearance) => set({ appearance: appearance }),
    setThemePreview: (themePreview) => set({ themePreview: themePreview }),
    setBorderRadius: (radius) => set({ borderRadius: radius }),
    setSelectedColor: (color, type) =>
      set({ selectedColor: { color: color, type: type } }),
  })),
);
