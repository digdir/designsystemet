import {
  type ColorScheme,
  type HexColor,
  type ThemeInfo,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import designsystemetConfig from '@digdir/designsystemet/configs/designsystemet.config.json';
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
  baseBorderRadius: BaseBorderRadius;
  setBaseBorderRadius: (radius: BaseBorderRadius) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  themeTab: 'overview' | 'colorsystem';
  setThemeTab: (tab: 'overview' | 'colorsystem') => void;
};

const { colors } = designsystemetConfig.themes.designsystemet;

const mapColorTheme = (colors: Record<string, string>) => {
  return Object.entries(colors).map(([key, value]) => ({
    name: key,
    colors: generateColorSchemes(value as HexColor),
  }));
};

export const useThemeStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    activePage: 'colors',
    setActivePage: (page) => set({ activePage: page }),
    baseBorderRadius: 4,
    colorScheme: 'light',
    colors: {
      main: mapColorTheme(colors.main),
      neutral: mapColorTheme({ neutral: colors.neutral }),
      support: mapColorTheme(colors.support),
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
  })),
);
