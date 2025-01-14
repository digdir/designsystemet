import { type ThemeInfo, luminance } from '@digdir/designsystemet/color';
import type { InterpolationMode } from 'chroma-js';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type BaseBorderRadius = number;
type LuminanceType = typeof luminance;
type ColorStore = {
  referenceLuminance: LuminanceType;
  luminance: LuminanceType;
  interpolationMode: InterpolationMode;
  colorScales: ThemeInfo[][];
  baseModifier: number;
  setBaseModifier: (baseModifier: number) => void;
  setColorScales: (colorScales: ThemeInfo[][]) => void;
  setInterpolationMode: (interpolationMode: InterpolationMode) => void;
  setLightLuminance: (luminance: LuminanceType) => void;
  setDarkLuminance: (luminance: LuminanceType) => void;
};

export const useDebugStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    luminance: luminance,
    referenceLuminance: luminance,
    interpolationMode: 'rgb',
    colorScales: [],
    baseModifier: 8,
    setBaseModifier: (baseModifier) => set({ baseModifier }),
    setColorScales: (colorScales) => set({ colorScales }),
    setInterpolationMode: (interpolationMode: InterpolationMode) =>
      set({ interpolationMode }),
    setLightLuminance: (luminance) => set({ luminance }),
    setDarkLuminance: (luminance) => set({ luminance }),
  })),
);
