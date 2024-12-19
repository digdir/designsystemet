import type { CssColor } from '../colors/types.js';

export type Token = { $value: string; $type: string };
export type Tokens1ary = Record<string, Token>;
export type Tokens2ary = Record<string, Tokens1ary>;
export type Tokens3ary = Record<string, Record<string, Tokens1ary>>;
export type TokensSet = Tokens1ary | Tokens2ary | Tokens3ary;

export type ColorModeTokens = {
  global: TokensSet;
  [key: string]: TokensSet;
};

// Define types for typography tokens
export type TypographyTokens = TokensSet;

// Define the main Tokens type
export type Tokens = {
  colors: {
    light: ColorModeTokens;
    dark: ColorModeTokens;
    contrast?: ColorModeTokens;
  };
  typography: {
    primary: TokensSet;
  };
};

export type Colors = {
  main: Record<string, CssColor>;
  support: Record<string, CssColor>;
  neutral: CssColor;
};
export type Typography = { fontFamily?: string };
export type TypographyModes = 'primary' | 'secondary';

export type File = {
  data: string;
  path: string;
  filePath: string;
};

export type Collection = string | 'global';

export type Theme = {
  name: string;
  colors: {
    main: Record<string, CssColor>;
    support: Record<string, CssColor>;
    neutral: CssColor;
  };
  typography: {
    fontFamily: string;
  };
  borderRadius: number;
};
