import {
  type ThemeInfo,
  generateColorSchemes,
  luminance,
} from '@digdir/designsystemet/color';
import type { InterpolationMode } from 'chroma-js';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type BaseBorderRadius = number;
export type LuminanceType = typeof luminance;
type ColorStore = {
  referenceLuminance: LuminanceType;
  luminance: LuminanceType;
  setLightLuminance: (luminance: LuminanceType) => void;
  setDarkLuminance: (luminance: LuminanceType) => void;
  interpolationMode: InterpolationMode;
  setInterpolationMode: (interpolationMode: InterpolationMode) => void;
  colorScales: ThemeInfo[][];
  setColorScales: (colorScales: ThemeInfo[][]) => void;
  colorScale: ThemeInfo;
  setColorScale: (colorScale: ThemeInfo) => void;
  baseModifier: number;
  setBaseModifier: (baseModifier: number) => void;
  conSubSettings: {
    lightnessMod: string;
  };
};

export const useDebugStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    luminance: luminance,
    referenceLuminance: luminance,
    interpolationMode: 'rgb',
    colorScales: [],
    colorScale: generateColorSchemes('#008000'),
    baseModifier: 8,
    setBaseModifier: (baseModifier) => set({ baseModifier }),
    setColorScales: (colorScales) => set({ colorScales }),
    setColorScale: (colorScale) => set({ colorScale }),
    setInterpolationMode: (interpolationMode: InterpolationMode) =>
      set({ interpolationMode }),
    setLightLuminance: (luminance) => set({ luminance }),
    setDarkLuminance: (luminance) => set({ luminance }),
  })),
);
