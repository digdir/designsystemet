import chroma from 'chroma-js';
import Colorjs from 'colorjs.io';
import { Hsluv } from 'hsluv';
import type { HexColor } from './types.ts';

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
