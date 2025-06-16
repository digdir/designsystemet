import type { ThemeInfo } from '@digdir/designsystemet/color';
import { create } from 'zustand';

export type ColorTheme = {
  name: string;
  colors: ThemeInfo;
};

export type BaseBorderRadius = number;

export const useThemeStore = create();
