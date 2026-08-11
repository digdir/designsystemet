export type ColorScheme = 'light' | 'dark';
export type ColorNumber = SemanticColorMap[keyof SemanticColorMap];
export type SemanticColorNames = keyof SemanticColorMap;
export type SeverityColorNames = 'danger' | 'info' | 'success' | 'warning';

export const semanticColorMap = {
  'background-default': 1,
  'background-tinted': 2,
  'surface-default': 3,
  'surface-tinted': 4,
  'surface-hover': 5,
  'surface-active': 6,
  'border-subtle': 7,
  'border-default': 8,
  'border-strong': 9,
  'text-subtle': 10,
  'text-default': 11,
  'base-default': 12,
  'base-hover': 13,
  'base-active': 14,
  'base-contrast-subtle': 15,
  'base-contrast-default': 16,
} as const;

type SemanticColorMap = typeof semanticColorMap;

type SemanticColorMapping = {
  [K in keyof SemanticColorMap]: {
    name: K;
    number: SemanticColorMap[K];
  };
};

export type SemanticColorSpec = {
  [P in keyof SemanticColorMapping]: SemanticColorMapping[P] & ColorScaleStep<SemanticColorNames>;
};

export type ColorScaleStep<T> = {
  name: T;
  number: ColorNumber;
  displayName: string;
  description: {
    short: string;
    long: string;
  };
  group: string;
  luminance: {
    light: number;
    dark: number;
    contrast: number;
  };
};

export type Color = ColorScaleStep<SemanticColorNames> & {
  hex: CssColor;
};

export type ThemeInfo = {
  light: Color[];
  dark: Color[];
};

/**
 * Supported CSS colors in `designsystemet/color`
 */
export type CssColor = HexColor;

export type HexColor = `#${string}`;
// type Percent = `${number}%`;
// type Degrees = `${number}deg`;
// type OkLchColor = `oklch(${Percent} ${number} ${Degrees})`;
