import {
  type ColorInfo,
  type ColorMode,
  type ThemeInfo,
  generateThemeForColor,
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
  appearance: ColorMode;
  setAppearance: (appearance: ColorMode) => void;
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
      main: [
        { name: 'dominant', colors: generateThemeForColor('#0062BA') },
        { name: 'secondary', colors: generateThemeForColor('#159CDE') },
        { name: 'accent', colors: generateThemeForColor('#F2800E') },
      ],
      neutral: [{ name: 'neutral', colors: generateThemeForColor('#1E2B3C') }],
      support: [
        { name: 'profilecolor-1', colors: generateThemeForColor('#F45F63') },
        { name: 'profilecolor-2', colors: generateThemeForColor('#E5AA20') },
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
