export type ColorScheme = 'light' | 'dark' | 'contrast';
export type ContrastMode = 'aa' | 'aaa';
export type ColorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type GlobalColors = 'red' | 'blue' | 'green' | 'orange' | 'purple';
export type ColorError = 'none' | 'decorative' | 'interaction';

export type ColorMetadata = {
  name: string;
  displayName: string;
  description: string;
  group: string;
  luminance: {
    light: number;
    dark: number;
    contrast: number;
  };
};

export type ColorInfo = ColorMetadata & {
  position: ColorNumber;
  hex: CssColor;
};

export type ThemeInfo = {
  light: ColorInfo[];
  dark: ColorInfo[];
  contrast: ColorInfo[];
};

/**
 * A valid CSS color.
 */
export type CssColor =
  | RgbHexColor
  | RgbColor
  | HslColor
  | HsvColor
  | HsluvColor
  | LabColor
  | LchColor
  | OkLabColor
  | OkLchColor
  | Cam02Color
  | rgbaColor
  | Cam02pColor;

/**
 * Different color formats.
 */
type RgbHexColor = `#${string}`;
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
type rgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`;

type Percent = `${number}%`;
type Degrees = `${number}deg`;
