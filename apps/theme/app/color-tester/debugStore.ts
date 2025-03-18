import {
  type ThemeInfo,
  colorMetadata,
  generateColorSchemes,
} from '@digdir/designsystemet/color';
import { ColorService, type IColor } from 'react-color-palette';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { InterpolationMode } from './logic/theme';

export type BaseBorderRadius = number;
export type ColorMetadataType = typeof colorMetadata;
export type ThemeSettingsType = {
  general: {
    testMode: 'debug' | 'production';
    colorScheme: 'light' | 'dark';
  };
  base: {
    modifier: number;
    darkOffset: number;
    negativeModeMin: number;
    negativeModRangeMin: number;
    negativeModRangeMax: number;
  };
  interpolation: {
    mode: InterpolationMode;
  };
  contrastSubtle: {
    lightnessMod: number;
    customModRangeMin: number;
    customModRangeMax: number;
    customModResult: number;
  };
};
export type PageType =
  | 'main'
  | 'saturation'
  | 'baseContrast'
  | 'scales'
  | 'colorTable'
  | 'mobile'
  | 'dash'
  | 'status'
  | 'article';

type ColorStore = {
  themeSettings: ThemeSettingsType;
  setThemeSettings: (themeSettings: ThemeSettingsType) => void;
  referenceColorMetadata: ColorMetadataType;
  colorMetadata: ColorMetadataType;
  pageType: PageType;
  setPageType: (pageType: PageType) => void;
  setLightLuminance: (
    luminance: ColorMetadataType,
    colorName: keyof ColorMetadataType,
  ) => void;
  setDarkLuminance: (
    luminance: ColorMetadataType,
    colorName: keyof ColorMetadataType,
  ) => void;
  colorScales: ThemeInfo[][];
  setColorScales: (colorScales: ThemeInfo[][]) => void;
  flatColorScales: {
    [key: string]: {
      low: ThemeInfo[];
      medium: ThemeInfo[];
      high: ThemeInfo[];
      veryHigh: ThemeInfo[];
    };
  };
  setFlatColorScales: (flatColorScales: {
    [key: string]: {
      low: ThemeInfo[];
      medium: ThemeInfo[];
      high: ThemeInfo[];
      veryHigh: ThemeInfo[];
    };
  }) => void;
  colorScale: ThemeInfo;
  setColorScale: (colorScale: ThemeInfo) => void;
  statusColors: {
    success: IColor;
    warning: IColor;
    info: IColor;
    error: IColor;
  };
  setStatusColors: (statusColors: {
    success: IColor;
    warning: IColor;
    info: IColor;
    error: IColor;
  }) => void;
};

export const useDebugStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    statusColors: {
      success: ColorService.convert('hex', '#068718'),
      warning: ColorService.convert('hex', '#ea9b1b'),
      info: ColorService.convert('hex', '#0A71C0'),
      error: ColorService.convert('hex', '#C01B1B'),
    },
    setStatusColors: (statusColors) => set({ statusColors }),
    themeSettings: {
      general: {
        testMode: 'debug',
        colorScheme: 'light',
      },
      base: {
        modifier: 8,
        darkOffset: 0,
        negativeModeMin: 30,
        negativeModRangeMin: 49.5,
        negativeModRangeMax: 66,
      },
      interpolation: {
        mode: 'rgb',
      },
      contrastSubtle: {
        lightnessMod: 50,
        customModRangeMin: 40,
        customModRangeMax: 60,
        customModResult: 60,
      },
    },
    pageType: 'main',
    setPageType: (pageType) => set({ pageType }),
    setThemeSettings: (themeSettings) => set({ themeSettings }),
    referenceColorMetadata: colorMetadata,
    colorMetadata: colorMetadata,
    colorScales: [],
    colorScale: generateColorSchemes('#008000'),
    setColorScales: (colorScales) => set({ colorScales }),
    setColorScale: (colorScale) => set({ colorScale }),
    setLightLuminance: (
      luminance: ColorMetadataType,
      colorName: keyof ColorMetadataType,
    ) =>
      set((state) => ({
        colorMetadata: {
          ...state.colorMetadata,
          background: {
            ...state.colorMetadata[colorName],
            luminance: {
              ...state.colorMetadata[colorName].luminance,
              light: luminance,
            },
          },
        },
      })),
    setDarkLuminance: (
      luminance: ColorMetadataType,
      colorName: keyof ColorMetadataType,
    ) =>
      set((state) => ({
        colorMetadata: {
          ...state.colorMetadata,
          [colorName]: {
            ...state.colorMetadata[colorName],
            luminance: {
              ...state.colorMetadata[colorName].luminance,
              dark: luminance,
            },
          },
        },
      })),
    flatColorScales: {
      default: {
        low: [],
        medium: [],
        high: [],
        veryHigh: [],
      },
    },
    setFlatColorScales: (flatColorScales) =>
      set({
        flatColorScales,
      }),
  })),
);
