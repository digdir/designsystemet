import type { CssColor } from '@adobe/leonardo-contrast-colors';
import type {
  ColorInfo,
  ColorMode,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type ColorTheme = {
  name: string;
  colors: ThemeInfo;
};

type StoreThemeType = {
  theme: ThemeInfo;
  color: CssColor;
};

type ColorStore = {
  colors: {
    main: ColorTheme[];
    neutral: ColorTheme[];
    support: ColorTheme[];
  };
  addColor: (
    newColor: ColorTheme,
    type: 'main' | 'neutral' | 'support',
  ) => void;
  updateColor: (
    updatedColor: ColorTheme,
    index: number,
    type: 'main' | 'neutral' | 'support',
  ) => void;
  resetColors: () => void;
  removeColor: (index: number, type: 'main' | 'neutral' | 'support') => void;
  selectedColor: { color: ColorInfo; name: string };
  setSelectedColor: (color: ColorInfo, name: string) => void;
  borderRadius: string;
  setBorderRadius: (radius: string) => void;
  appearance: 'light' | 'dark';
  setAppearance: (appearance: ColorMode) => void;
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
      name: 'Default',
    },
    borderRadius: '0.25rem',
    appearance: 'light',
    themePreview: 'one',
    colors: {
      main: [],
      neutral: [],
      support: [],
    },
    addColor: (newColor, type) =>
      set((state) => {
        const updatedColors = state.colors[type].concat(newColor);
        return { colors: { ...state.colors, [type]: updatedColors } };
      }),
    updateColor: (updatedColor, index, type) =>
      set((state) => {
        const updatedColors = state.colors[type].map((color, i) =>
          i === index ? updatedColor : color,
        );
        return { colors: { ...state.colors, [type]: updatedColors } };
      }),
    resetColors: () => {
      set({ colors: { main: [], neutral: [], support: [] } });
    },
    removeColor: (index, type) =>
      set((state) => {
        const updatedColors = state.colors[type].filter((_, i) => i !== index);
        return { colors: { ...state.colors, [type]: updatedColors } };
      }),
    setAppearance: (appearance) => set({ appearance: appearance }),
    setThemePreview: (themePreview) => set({ themePreview: themePreview }),
    setBorderRadius: (radius) => set({ borderRadius: radius }),
    setSelectedColor: (color, name) =>
      set({ selectedColor: { color: color, name: name } }),
  })),
);
