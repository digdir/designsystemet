import chroma from 'chroma-js';
import Colorjs from 'colorjs.io';
import { Hsluv } from 'hsluv';
import type { CssColor, HexColor } from './types.js';

/**
 * Converts a HEX color '#xxxxxx' into a CSS HSL string 'hsl(x,x,x)'
 *
 * @param hex A hex color string
 * @param valuesOnly If true, only the values are returned
 * @returns A CSS HSL string
 */
export const hexToCssHsl = (hex: HexColor, valuesOnly = false) => {
  const [h, s, l] = chroma(hex).hsl();
  const hRounded = Math.round(h);
  const sRounded = Math.round(s * 100);
  const lRounded = Math.round(l * 100);
  const cssString = `${hRounded},${sRounded}%,${lRounded}%`;
  return valuesOnly ? cssString : `hsl(${cssString})`;
};

/**
 * Converts a HEX string '#xxxxxx' into an array of HSL values '[h,s,l]'
 *
 * @param H A Hex color string
 * @returns HSL values in an array
 */
export const hexToHSL = (hex: HexColor) => {
  const [h, s, l] = chroma(hex).hsl();
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
};

/**
 * Converts a HEX color '#xxxxxx' into an array of HSLuv values '[h,s,l]'
 *
 * @param hex A hex color string
 * @returns
 */
export const hexToHsluv = (hex: HexColor) => {
  const conv = new Hsluv();
  conv.hex = hex;
  conv.hexToHsluv();
  return [conv.hsluv_h, conv.hsluv_s, conv.hsluv_l];
};

/**
 * Converts a HSL number array '[h,s,l]' into HSL CSS string 'hsl(x,x,x)'
 *
 * @param HSL A HSL number array '[h,s,l]'
 * @returns A hex color string
 */
export const hslArrToCss = (HSL: number[]) => {
  return 'hsl(' + HSL[0] + ',' + HSL[1] + '%,' + HSL[2] + '%)';
};

/**
 * Converts a HSL CSS string 'hsl(x,x,x)' into an array of HSL values '[h,s,l]'
 *
 * @param h The HSL hue
 * @param s The HSL saturation
 * @param l The HSL lightness
 * @returns HEX color string
 */
export const HSLToHex = (h: number, s: number, l: number): HexColor => {
  return chroma.hsl(h, s / 100, l / 100).hex() as HexColor;
};

/**
 * Converts a HEX color '#xxxxxx' into an array of RGB values '[R, G, B]'
 *
 * @param hex A hex color string
 * @param type The type of RGB values to return
 * @returns RGB values in an array
 */
export const hexToRgb = (hex: string, type: '255' | '1' = '255') => {
  const rgb = chroma(hex).rgb();
  return {
    r: type === '255' ? rgb[0] : rgb[0] / 255,
    g: type === '255' ? rgb[1] : rgb[1] / 255,
    b: type === '255' ? rgb[2] : rgb[2] / 255,
  };
};

/**
 * Get the contrast ratio between two HEX colors
 *
 * @param color1 The first color to compare
 * @param color2 The second color to compare
 * @returns
 */
export const getContrastFromHex = (color1: HexColor, color2: HexColor) => {
  const lum1 = chroma(color1).luminance();
  const lum2 = chroma(color2).luminance();
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
};

/**
 * Get the contrast ratio between two colors at a specific lightness
 *
 * @param lightness The lightness value
 * @param mainColor The main color
 * @param backgroundColor The background color
 * @returns The contrast ratio
 */
export const getContrastFromLightness = (lightness: number, mainColor: CssColor, backgroundColor: CssColor) => {
  const conv = new Hsluv();
  conv.hex = mainColor;
  conv.hexToHsluv();
  conv.hsluv_l = lightness;
  conv.hsluvToHex();
  const lightMainColor = conv.hex;
  const lum1 = chroma(lightMainColor).luminance();
  const lum2 = chroma(backgroundColor).luminance();
  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);

  return ratio;
};

/**
 * Check if two colors have enough contrast to be used together
 *
 * @param color1 The first color
 * @param color2 The second color
 * @returns If the colors have enough contrast
 */
export const areColorsContrasting = (color1: CssColor, color2: CssColor, type: 'decorative' | 'aa' | 'aaa' = 'aa') => {
  const contrast = getContrastFromHex(color1, color2);
  if (contrast !== null) {
    if (type === 'aaa') {
      return contrast >= 7;
    }
    if (type === 'aa') {
      return contrast >= 4.5;
    }
    return contrast >= 3;
  }
  return false;
};

/**
 * Check if aa string value is a HEX color
 *
 * @param hex The hex color
 */
export const isHexColor = (hex: string) => {
  return typeof hex === 'string' && hex.length === 6 && !Number.isNaN(Number('0x' + hex));
};

/**
 * Get the luminance value from a lightness value
 *
 * @param lightness The lightness value
 */
export const getLuminanceFromLightness = (lightness: number) => {
  const conv = new Hsluv();
  conv.hsluv_l = lightness;
  conv.hsluvToHex();

  return chroma(conv.hex).luminance();
};

/**
 * Get the relative luminance from any valid css color
 *
 * @param color
 */
export const getLuminanceFromColor = (color: string) => {
  return chroma(color).luminance();
};

/**
 * Get the HSLuv lightness from a HEX color
 *
 * @param hex The hex color
 */
export const getLightnessFromHex = (hex: HexColor) => {
  const conv = new Hsluv();
  conv.hex = hex;
  conv.hexToHsluv();

  return conv.hsluv_l;
};

/**
 *
 * This function checks if white or black text can be used on 2 different colors at 4.5:1 contrast.
 *
 * @param baseDefaultColor Base default color
 * @param baseActiveColor Base active color
 */
export const canTextBeUsedOnColors = (baseDefaultColor: CssColor, baseActiveColor: CssColor) => {
  const defaultAgainstWhite = getContrastFromHex(baseDefaultColor, '#ffffff');
  const defaultAgainstBlack = getContrastFromHex(baseDefaultColor, '#000000');

  const activeAgainstWhite = getContrastFromHex(baseActiveColor, '#ffffff');
  const activeAgainstBlack = getContrastFromHex(baseActiveColor, '#000000');

  if (defaultAgainstWhite >= 4.5 && activeAgainstWhite >= 4.5) {
    return true;
  }
  if (defaultAgainstBlack >= 4.5 && activeAgainstBlack >= 4.5) {
    return true;
  }

  return false;
};

/**
 * Converts a color to a HEX color
 *
 * @param color
 * @returns
 */
export const convertToHex = (color?: string): HexColor => {
  if (!color) {
    return '#000000';
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return color as HexColor;
  }
  return chroma(color).hex() as HexColor;
};

export const rgbToHex = (rgb: { r: number; g: number; b: number }): HexColor => {
  return `#${[rgb.r, rgb.g, rgb.b]
    .map((x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('')}`;
};

/**
 * Convert a color to a different format
 *
 * @param cssColor Any valid css color
 * @param format Color space/format supported here https://colorjs.io/docs/spaces
 */
export const convertColor = (cssColor: string, format: string) => {
  const color = new Colorjs(cssColor);
  switch (format) {
    case 'rgb':
    case 'rgba':
      //return rgb(0-255 0-255 0-255) instead of percentages
      return color.toString({
        format: {
          name: format,
          coords: ['<number>[0, 255]', '<number>[0, 255]', '<number>[0, 255]'],
        },
        precision: 3,
      });
    case 'hex':
      return color.toString({ format: format, precision: 3 });
    case 'hct':
      return color.to(format).toString({
        format: {
          name: format,
          coords: ['<number>', '<number>', '<number>'],
        },
        precision: 3,
      });
    default:
      return color.to(format).toString({ precision: 3 });
  }
};
