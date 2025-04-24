import {
  type ColorScheme,
  type ColorSettings,
  DefaultColorSettings,
  type ThemeInfo,
  baseColors,
  colorMetadata,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type ColorTheme = {
  name: string;
  colors: ThemeInfo;
  settings: ColorSettings;
};

export type BaseBorderRadius = number;
export type ColorMetadataType = typeof colorMetadata;
type PageType =
  | 'colors'
  | 'color'
  | 'dimensions'
  | 'advancedColors'
  | 'lightness';

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
    status: ColorTheme[];
  };
  getColorTheme: (
    index: number,
    type: 'main' | 'neutral' | 'support',
  ) => ColorTheme | undefined;
  addColor: (
    newColor: ColorTheme,
    type: 'main' | 'neutral' | 'support',
  ) => void;
  updateColorTheme: (
    updatedTheme: ColorTheme,
    index: number,
    type: 'main' | 'neutral' | 'support',
  ) => void;
  resetColors: () => void;
  removeColor: (index: number, type: 'main' | 'neutral' | 'support') => void;
  baseBorderRadius: BaseBorderRadius;
  setBaseBorderRadius: (radius: BaseBorderRadius) => void;
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
  themeTab: 'overview' | 'colorsystem' | 'contrast' | 'typography' | 'radius';
  setThemeTab: (
    tab:
      | 'overview'
      | 'colorsystem'
      | 'contrast'
      | 'typography'
      | 'radius'
      | 'contrast',
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
    getColorTheme: (index, type): ColorTheme | undefined => {
      const colors = useThemeStore.getState().colors[type];
      return colors[index];
    },
    activePage: 'colors',
    setActivePage: (page) => set({ activePage: page }),
    baseBorderRadius: 4,
    colorScheme: 'light',
    colors: {
      main: [
        {
          name: 'primary',
          colors: generateColorSchemes(
            '#0062BA',
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
        },
        {
          name: 'accent',
          colors: generateColorSchemes(
            '#1E98F5',
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
        },
      ],
      neutral: [
        {
          name: 'neutral',
          colors: generateColorSchemes(
            '#1E2B3C',
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
        },
      ],
      support: [
        {
          name: 'extra1',
          colors: generateColorSchemes(
            '#F45F63',
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
        },
        {
          name: 'extra2',
          colors: generateColorSchemes(
            '#E5AA20',
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
        },
      ],
      status: [
        {
          name: 'info',
          colors: generateColorSchemes(
            baseColors.blue,
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
        },
        {
          name: 'success',
          colors: generateColorSchemes(
            baseColors.green,
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
        },
        {
          name: 'warning',
          colors: generateColorSchemes(
            baseColors.orange,
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
        },
        {
          name: 'error',
          colors: generateColorSchemes(
            baseColors.red,
            colorMetadata,
            JSON.parse(JSON.stringify(DefaultColorSettings)),
          ),
          settings: JSON.parse(JSON.stringify(DefaultColorSettings)),
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
    updateColorTheme: (updatedColorTheme, index, type) =>
      set((state) => {
        const updatedColors = state.colors[type].map((color, i) =>
          i === index ? updatedColorTheme : color,
        );
        return { colors: { ...state.colors, [type]: updatedColors } };
      }),
    resetColors: () => {
      set({ colors: { main: [], neutral: [], support: [], status: [] } });
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
