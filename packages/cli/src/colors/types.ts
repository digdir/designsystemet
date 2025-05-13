export type ColorScheme = 'light' | 'dark' | 'contrast';
export type ContrastMode = 'aa' | 'aaa';
export type ColorNumber = SemanticColorNumberMap[keyof SemanticColorNumberMap];
export type ColorNames = keyof SemanticColorNumberMap;
export type GlobalColors = 'red' | 'blue' | 'green' | 'orange' | 'purple';
export type ColorError = 'none' | 'decorative' | 'interaction';
export type InterpolationMode = 'hcl' | 'hsi' | 'hsl' | 'hsv' | 'lab' | 'lch' | 'lrgb' | 'oklab' | 'oklch' | 'rgb';

type SemanticColorNumberMap = {
  'background-default': 1;
  'background-tinted': 2;
  'surface-default': 3;
  'surface-tinted': 4;
  'surface-hover': 5;
  'surface-active': 6;
  'border-subtle': 7;
  'border-default': 8;
  'border-strong': 9;
  'text-subtle': 10;
  'text-default': 11;
  'base-default': 12;
  'base-hover': 13;
  'base-active': 14;
  'base-contrast-subtle': 15;
  'base-contrast-default': 16;
};

type SemanticColorMapping = {
  [K in keyof SemanticColorNumberMap]: {
    name: K;
    number: SemanticColorNumberMap[K];
  };
};

export type ColorMetadataByName = {
  [P in keyof SemanticColorMapping]: SemanticColorMapping[P] & ColorMetadata;
};

export type ColorMetadata = {
  name: ColorNames;
  number: ColorNumber;
  displayName: string;
  description: {
    short: string;
    long: string;
  };
  group: string;
  /** The luminance of the color in light and dark mode */
  lightness: {
    light: number;
    dark: number;
    contrast: number;
  };
  /** The saturation of the color in light and dark mode */
  saturation: {
    light: number;
    dark: number;
    contrast: number;
  };
  /** The interpolation mode for the color */
  interpolation: InterpolationMode;
  baseModifier: {
    light: number;
    dark: number;
    contrast: number;
  };
};

export type Color = ColorMetadata & {
  hex: CssColor;
};

export type ThemeInfo = {
  light: Color[];
  dark: Color[];
  contrast: Color[];
};

/**
 * Supported CSS colors in `designsystemet/color`
 */
export type CssColor = HexColor;

/**
 * Different color formats.
 */
export type HexColor = `#${string}`;
type RgbColor = `rgb(${number} ${number} ${number})`;
type HslColor = `hsl(${Degrees} ${Percent} ${Percent})`;
type HsvColor = `hsv(${Degrees} ${Percent} ${Percent})`;
type HsluvColor = `hsluv(${number} ${number} ${number})`;
type LabColor = `lab(${Percent} ${number} ${number})`;
type LchColor = `lch(${Percent} ${number} ${Degrees})`;
type OkLabColor = `oklab(${Percent} ${number} ${number})`;
type OkLchColor = `oklch(${Percent} ${number} ${Degrees})`;
type Cam02Color = `jab(${Percent} ${number} ${number})`;
type Cam02pColor = `jch(${Percent} ${number} ${Degrees})`;
type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`;

type Percent = `${number}%`;
type Degrees = `${number}deg`;
