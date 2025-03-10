import type { CssColor } from '../colors/types.js';

export type Token = { $value: string; $type: string };
export type TokensSet = {
  [key: string]: Token | TokensSet;
};

export type ColorModeTokens = {
  global: TokensSet;
  [key: string]: TokensSet;
};

// Define types for typography tokens
export type TypographyTokens = TokensSet;

// Define the main Tokens type
export type Tokens = {
  primitives: {
    'colors-scheme': {
      light: ColorModeTokens;
      dark: ColorModeTokens;
      contrast?: ColorModeTokens;
    };
    typography: {
      primary: TokensSet;
    };
  };
  semantic?: {
    modes: {
      'main-color': Record<string, TokensSet>;
      'support-color': Record<string, TokensSet>;
    };
    color: TokensSet;
    style?: TokensSet;
  };
  themes?: Record<string, TokensSet>;
};

export type SemanticModes = {
  'main-color': Record<string, TokensSet>;
  'support-color': Record<string, TokensSet>;
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
  colors: Colors;
  typography: Typography;
  borderRadius: number;
};
