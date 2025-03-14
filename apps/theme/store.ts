import {
  type Color,
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

export type BaseBorderRadius = number;
type PageType = 'colors' | 'dimensions';

type ColorStore = {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
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
  selectedColor: { color: Color; name: string };
  setSelectedColor: (color: Color, name: string) => void;
  baseBorderRadius: BaseBorderRadius;
  setBaseBorderRadius: (radius: BaseBorderRadius) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  themeTab: 'overview' | 'colorsystem';
  setThemeTab: (tab: 'overview' | 'colorsystem') => void;
};

export const useThemeStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    activePage: 'colors',
    setActivePage: (page) => set({ activePage: page }),
    selectedColor: {
      color: {
        hex: '#ffffff',
        number: 1,
        name: 'background-default',
        displayName: 'Default',
        group: 'neutral',
        description: {
          long: '',
          short: '',
        },
        luminance: {
          light: 0,
          dark: 0,
          contrast: 0,
        },
      },
      name: 'Default',
    },
    baseBorderRadius: 4,
    colorScheme: 'light',
    colors: {
      main: [
        { name: 'primary', colors: generateColorSchemes('#0062BA') },
        { name: 'accent', colors: generateColorSchemes('#1E98F5') },
      ],
      neutral: [{ name: 'neutral', colors: generateColorSchemes('#1E2B3C') }],
      support: [
        { name: 'extra1', colors: generateColorSchemes('#F45F63') },
        { name: 'extra2', colors: generateColorSchemes('#E5AA20') },
      ],
    },
    themeTab: 'overview',
    setThemeTab: (tab) => set({ themeTab: tab }),
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
    setColorScheme: (colorScheme) => set({ colorScheme }),
    setBaseBorderRadius: (radius) => set({ baseBorderRadius: radius }),
    setSelectedColor: (color, name) =>
      set({ selectedColor: { color: color, name: name } }),
  })),
);
