import {
  type ColorInfo,
  type ColorScheme,
  type ThemeInfo,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type ColorTheme = {
  name: string;
  colors: ThemeInfo;
};

type BorderRadiusGroup = 'none' | 'small' | 'medium' | 'large' | 'full';
type PageType = 'intro' | 'colors' | 'radius' | 'finish';

type ColorStore = {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  colors: {
    main: ColorTheme[];
    neutral: ColorTheme[];
    support: ColorTheme[];
  };
  themeName: string;
  setThemeName: (name: string) => void;
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
  borderRadius: BorderRadiusGroup;
  setBorderRadius: (radius: BorderRadiusGroup) => void;
  appearance: ColorScheme;
  setAppearance: (appearance: ColorScheme) => void;
  themePreview: 'one' | 'two' | 'three';
  setThemePreview: (theme: 'one' | 'two' | 'three') => void;
};

export const useThemeStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    activePage: 'colors',
    setActivePage: (page) => set({ activePage: page }),
    selectedColor: {
      color: {
        hex: '#ffffff',
        number: 1,
        name: 'Default',
      },
      name: 'Default',
    },
    borderRadius: 'small',
    appearance: 'light',
    themePreview: 'one',
    colors: {
      main: [{ name: 'accent', colors: generateColorSchemes('#0062BA') }],
      neutral: [{ name: 'neutral', colors: generateColorSchemes('#1E2B3C') }],
      support: [
        { name: 'brand1', colors: generateColorSchemes('#F45F63') },
        { name: 'brand2', colors: generateColorSchemes('#E5AA20') },
        { name: 'brand3', colors: generateColorSchemes('#1E98F5') },
      ],
    },
    themeName: 'theme',
    setThemeName: (name) => set({ themeName: name }),
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
