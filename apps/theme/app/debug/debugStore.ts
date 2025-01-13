import { luminance } from '@digdir/designsystemet/color';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type BaseBorderRadius = number;
type LuminanceType = typeof luminance;
type ColorStore = {
  luminance: LuminanceType;
  setLightLuminance: (luminance: LuminanceType) => void;
  setDarkLuminance: (luminance: LuminanceType) => void;
};

export const useDebugStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    luminance: luminance,
    setLightLuminance: (luminance) => set({ luminance }),
    setDarkLuminance: (luminance) => set({ luminance }),
  })),
);
