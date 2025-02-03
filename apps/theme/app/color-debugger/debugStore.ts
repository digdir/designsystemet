import {
  type ThemeInfo,
  generateColorSchemes,
  luminance,
} from '@digdir/designsystemet/color';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { InterpolationMode } from './logic/theme';

export type BaseBorderRadius = number;
export type LuminanceType = typeof luminance;
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
  | 'article';

type ColorStore = {
  themeSettings: ThemeSettingsType;
  setThemeSettings: (themeSettings: ThemeSettingsType) => void;
  referenceLuminance: LuminanceType;
  luminance: LuminanceType;
  pageType: PageType;
  setPageType: (pageType: PageType) => void;
  setLightLuminance: (luminance: LuminanceType) => void;
  setDarkLuminance: (luminance: LuminanceType) => void;
  colorScales: ThemeInfo[][];
  setColorScales: (colorScales: ThemeInfo[][]) => void;
  colorScale: ThemeInfo;
  setColorScale: (colorScale: ThemeInfo) => void;
};

export const useDebugStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
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
        negativeModRangeMax: 65,
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
    luminance: luminance,
    referenceLuminance: luminance,
    colorScales: [],
    colorScale: generateColorSchemes('#008000'),
    setColorScales: (colorScales) => set({ colorScales }),
    setColorScale: (colorScale) => set({ colorScale }),
    setLightLuminance: (luminance) => set({ luminance }),
    setDarkLuminance: (luminance) => set({ luminance }),
  })),
);
