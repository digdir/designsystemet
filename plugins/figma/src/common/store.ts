import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { FigmaModeName } from './types';

export type ColorInfo = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  13: string;
  'contrast-1': string;
  'contrast-2': string;
};

export type ColorIndex =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | 'contrast-1'
  | 'contrast-2';

export type StoreThemes = StoreTheme[];

export type StoreTheme = {
  name: string;
  themeId: string;
  themeModeId: string;
  colors: ColorTheme;
};

export type ColorTheme = {
  accent: ThemeInfo;
  neutral: ThemeInfo;
  brand1: ThemeInfo;
  brand2: ThemeInfo;
  brand3: ThemeInfo;
};

export type ThemeInfo = {
  light: ColorInfo;
  dark: ColorInfo;
  contrast?: ColorInfo;
};

export type StoreThemeModes = {
  name: string;
  id: string;
  prefix: FigmaModeName;
  colors: { brand1Base: string; brand2Base: string; brand3Base: string };
};

type ColorStore = {
  themes: StoreThemes;
  loading: boolean;
  codeSnipperError: string;
  noThemesFound: boolean;
  setThemes: (themes: StoreThemes) => void;
  setLoading: (loading: boolean) => void;
  setCodeSnippetError: (error: string) => void;
  setNoThemesFound: (noThemesFound: boolean) => void;
};

export const useThemeStore = create(
  subscribeWithSelector<ColorStore>((set) => ({
    themes: [],
    loading: false,
    codeSnipperError: '',
    noThemesFound: false,
    setThemes: (themes) => set({ themes }),
    setLoading: (loading) => set({ loading }),
    setCodeSnippetError: (codeSnipperError) => set({ codeSnipperError }),
    setNoThemesFound: (noThemesFound) => set({ noThemesFound }),
  })),
);
