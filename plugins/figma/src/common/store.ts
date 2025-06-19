import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { InferredColorTheme } from './dummyTheme';

export type ColorInfo = {
  [key in ColorIndex]: string;
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
  | '14'
  | '15'
  | '16';

export type StoreThemes = StoreTheme[];

export type StoreTheme = {
  name: string;
  themeId: string;
  themeModeId: string;
  colors: ColorTheme;
};

export type ColorTheme = InferredColorTheme;

export type ThemeInfo = {
  light: ColorInfo;
  dark: ColorInfo;
  contrast?: ColorInfo;
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
