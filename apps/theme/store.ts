import type { CssColor } from '@adobe/leonardo-contrast-colors';
import type {
  ColorInfo,
  ThemeColors,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type StoreThemeType = {
  theme: ThemeInfo;
  color: CssColor;
};

type ColorStore = {
  theme: {
    colors: ThemeInfo[];
  };
  setTheme: (theme: StoreThemeType) => void;
  selectedColor: { color: ColorInfo; type: ThemeColors };
  setSelectedColor: (color: ColorInfo, type: ThemeColors) => void;
  borderRadius: string;
  setBorderRadius: (radius: string) => void;
  appearance: 'light' | 'dark';
  setAppearance: (appearance: 'light' | 'dark') => void;
  themePreview: 'one' | 'two' | 'three';
  setPreviewTheme: (theme: 'one' | 'two' | 'three') => void;
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
    theme: {
      colors: []
    },
    setTheme
    setAppearance: (appearance) => set({ appearance: appearance }),
    setThemePreview: (theme) => set({ theme: theme }),
    setBorderRadius: (radius) => set({ borderRadius: radius }),
    setSelectedColor: (color, type) =>
      set({ selectedColor: { color: color, type: type } }),
  })),
);
