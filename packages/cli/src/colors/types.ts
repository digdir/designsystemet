export type ColorScheme = 'light' | 'dark' | 'contrast';
export type ContrastMode = 'aa' | 'aaa';
export type ColorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type ColorNames = keyof SemanticColorMapping;
export type GlobalColors = 'red' | 'blue' | 'green' | 'orange' | 'purple';
export type ColorError = 'none' | 'decorative' | 'interaction';

type SemanticColorMapping = {
  'background-default': {
    name: 'background-default';
    number: 1;
  };
  'background-tinted': {
    name: 'background-tinted';
    number: 2;
  };
  'surface-default': {
    name: 'surface-default';
    number: 3;
  };
  'surface-tinted': {
    name: 'surface-tinted';
    number: 4;
  };
  'surface-hover': {
    name: 'surface-hover';
    number: 5;
  };
  'surface-active': {
    name: 'surface-active';
    number: 6;
  };
  'border-subtle': {
    name: 'border-subtle';
    number: 7;
  };
  'border-default': {
    name: 'border-default';
    number: 8;
  };
  'border-strong': {
    name: 'border-strong';
    number: 9;
  };
  'text-subtle': {
    name: 'text-subtle';
    number: 10;
  };
  'text-default': {
    name: 'text-default';
    number: 11;
  };
  'base-default': {
    name: 'base-default';
    number: 12;
  };
  'base-hover': {
    name: 'base-hover';
    number: 13;
  };
  'base-active': {
    name: 'base-active';
    number: 14;
  };
  'base-contrast-subtle': {
    name: 'base-contrast-subtle';
    number: 15;
  };
  'base-contrast-default': {
    name: 'base-contrast-default';
    number: 16;
  };
};

export type ColorMetadataByName = {
  [P in keyof SemanticColorMapping]: SemanticColorMapping[P] & ColorMetadata;
};

export type ColorMetadata = {
  name: ColorNames;
  number: ColorNumber;
  displayName: string;
  description: string;
  group: string;
  luminance: {
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
