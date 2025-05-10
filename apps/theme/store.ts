import {
  type ColorMetadataByName,
  type ColorScheme,
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
  colorMetadata: ColorMetadataByName;
};

export type BaseBorderRadius = number;
type PageType =
  | 'front'
  | 'colors'
  | 'color'
  | 'dimensions'
  | 'advancedColors'
  | 'lightness';

type ColorStore = {
  showStatusColors: boolean;
  setShowStatusColors: (show: boolean) => void;
  activeColorScale: string;
  setActiveColorScale: (scale: string) => void;
  onColorThemeChange: number;
  setOnColorThemeChange: (value: number) => void;
  referenceColorMetadata: ColorMetadataByName;
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
    type: 'main' | 'neutral' | 'support' | 'status',
  ) => ColorTheme | undefined;
  addColor: (
    newColor: ColorTheme,
    type: 'main' | 'neutral' | 'support' | 'status',
  ) => void;
  updateColorTheme: (
    updatedTheme: ColorTheme,
    index: number,
    type: 'main' | 'neutral' | 'support' | 'status',
  ) => void;
  resetColors: () => void;
  removeColor: (
    index: number,
    type: 'main' | 'neutral' | 'support' | 'status',
  ) => void;
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
    showStatusColors: false,
    setShowStatusColors: (show) => set({ showStatusColors: show }),
    activeColorScale: 'primary',
    setActiveColorScale: (scale) => set({ activeColorScale: scale }),
    onColorThemeChange: 0,
    setOnColorThemeChange: (value) => set({ onColorThemeChange: value }),
    referenceColorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
    getColorTheme: (index, type): ColorTheme | undefined => {
      const colors = useThemeStore.getState().colors[type];
      return colors[index];
    },
    activePage: 'front',
    setActivePage: (page) => set({ activePage: page }),
    baseBorderRadius: 4,
    colorScheme: 'light',
    colors: {
      main: [
        {
          name: 'primary',
          colors: generateColorSchemes(
            '#0062BA',
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
        {
          name: 'accent',
          colors: generateColorSchemes(
            '#1E98F5',
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
      ],
      neutral: [
        {
          name: 'neutral',
          colors: generateColorSchemes(
            '#1E2B3C',
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
      ],
      support: [
        {
          name: 'extra1',
          colors: generateColorSchemes(
            '#F45F63',
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
        {
          name: 'extra2',
          colors: generateColorSchemes(
            '#E5AA20',
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
      ],
      status: [
        {
          name: 'info',
          colors: generateColorSchemes(
            baseColors.blue,
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
        {
          name: 'success',
          colors: generateColorSchemes(
            baseColors.green,
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
        {
          name: 'warning',
          colors: generateColorSchemes(
            baseColors.orange,
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
        {
          name: 'error',
          colors: generateColorSchemes(
            baseColors.red,
            JSON.parse(JSON.stringify(colorMetadata)),
          ),
          colorMetadata: JSON.parse(JSON.stringify(colorMetadata)),
        },
      ],
    },
    themeTab: 'colorsystem',
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
      set({
        colors: JSON.parse(
          JSON.stringify({ main: [], neutral: [], support: [], status: [] }),
        ),
      });
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
