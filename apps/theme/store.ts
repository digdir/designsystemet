import {
  type ColorScheme,
  type ThemeInfo,
  colorMetadata,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type ColorTheme = {
  name: string;
  staticSaturation: string;
  colors: ThemeInfo;
};

export type BaseBorderRadius = number;
export type ColorMetadataType = typeof colorMetadata;
type PageType = 'colors' | 'dimensions';

type ColorStore = {
  colorMetadata: ColorMetadataType;
  referenceColorMetadata: ColorMetadataType;
  setLuminance: (
    luminance: ColorMetadataType,
    type: 'light' | 'dark',
    colorName: keyof ColorMetadataType,
  ) => void;
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
  setThemeTab: (
    tab: 'overview' | 'colorsystem' | 'contrast' | 'typography' | 'radius',
  ) => void;
  updateStaticSaturation: (
    saturation: string,
    index: number,
    type: 'main' | 'neutral' | 'support',
  ) => void;
};

export const useThemeStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    colorMetadata: colorMetadata,
    referenceColorMetadata: colorMetadata,
    setLuminance: (
      luminance: ColorMetadataType,
      type: 'light' | 'dark',
      colorName: keyof ColorMetadataType,
    ) =>
      set((state) => ({
        colorMetadata: {
          ...state.colorMetadata,
          background: {
            ...state.colorMetadata[colorName],
            luminance: {
              ...state.colorMetadata[colorName].luminance,
              [type]: luminance,
            },
          },
        },
      })),
    activePage: 'colors',
    setActivePage: (page) => set({ activePage: page }),
    baseBorderRadius: 4,
    colorScheme: 'light',
    colors: {
      main: [
        {
          name: 'primary',
          colors: generateColorSchemes('#0062BA'),
          staticSaturation: '1',
        },
        {
          name: 'accent',
          colors: generateColorSchemes('#1E98F5'),
          staticSaturation: '1',
        },
      ],
      neutral: [
        {
          name: 'neutral',
          colors: generateColorSchemes('#1E2B3C'),
          staticSaturation: '1',
        },
      ],
      support: [
        {
          name: 'extra1',
          colors: generateColorSchemes('#F45F63'),
          staticSaturation: '1',
        },
        {
          name: 'extra2',
          colors: generateColorSchemes('#E5AA20'),
          staticSaturation: '1',
        },
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
    updateStaticSaturation: (
      saturation: string,
      index: number,
      type: 'main' | 'neutral' | 'support',
    ) =>
      set((state) => {
        const updatedColors = state.colors[type].map((color, i) =>
          i === index ? { ...color, staticSaturation: saturation } : color,
        );
        return { colors: { ...state.colors, [type]: updatedColors } };
      }),
  })),
);
