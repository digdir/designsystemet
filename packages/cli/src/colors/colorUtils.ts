import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { Hsluv } from 'hsluv';
import chroma from 'chroma-js';

import type { Mode } from './types.ts';
/**
 * Converts a HEX color '#xxxxxx' into a CSS HSL string 'hsl(x,x,x)'
 *
 * @param hex A hex color string
 * @param valuesOnly If true, only the values are returned
 * @returns A CSS HSL string
 */
export const hexToCssHsl = (hex: string, valuesOnly = false) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = 0;
  let g = 0;
  let b = 0;
  let cssString = '';
  if (result) {
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
  }
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
  }

  h = Math.round(h ? h * 360 : 0);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  cssString = h + ',' + s + '%,' + l + '%';
  cssString = !valuesOnly ? 'hsl(' + cssString + ')' : cssString;

  return cssString;
};

/**
 * Converts a HEX string '#xxxxxx' into an array of HSL values '[h,s,l]'
 *
 * @param H A Hex color string
 * @returns HSL values in an array
 */
export const hexToHSL = (H: string) => {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0;
  if (H.length == 4) {
    r = parseInt('0x' + H[1] + H[1]);
    g = parseInt('0x' + H[2] + H[2]);
    b = parseInt('0x' + H[3] + H[3]);
  } else if (H.length == 7) {
    r = parseInt('0x' + H[1] + H[2]);
    g = parseInt('0x' + H[3] + H[4]);
    b = parseInt('0x' + H[5] + H[6]);
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let h = 0,
    s = 0,
    l = 0;
  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
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
export const HSLToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;

  let r = 0,
    g = 0,
    b = 0;
  const c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = parseInt(Math.round((r + m) * 255).toString(16), 16);
  g = parseInt(Math.round((g + m) * 255).toString(16), 16);
  b = parseInt(Math.round((b + m) * 255).toString(16), 16);

  // Prepend 0s, if necessary
  if (r.toString().length == 1) r = parseInt('0' + r.toString(), 10);
  if (g.toString().length == 1) g = parseInt('0' + g.toString(), 10);
  if (b.toString().length == 1) b = parseInt('0' + b.toString(), 10);

  return '#' + r + g + b;
};

/**
 * Converts a HEX color '#xxxxxx' into an array of RGB values '[R, G, B]'
 *
 * @param hex A hex color string
 * @returns RGB values in an array
 */
export const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r: string, g: string, b: string) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Get the luminance of an RGB color
 *
 * @param r RGB red value
 * @param G RGB green value
 * @param b RGB blue value
 * @returns
 */
export const luminanceFromRgb = (r: string, g: string, b: string) => {
  const a = [Number(r), Number(g), Number(b)].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

/**
 * Get the luminance of a HEX color
 *
 * @param hex A hex color string
 * @returns
 */
export const luminanceFromHex = (hex: CssColor) => {
  const rgb = hexToRgb(hex);
  if (rgb) {
    const r = rgb.r.toString();
    const g = rgb.g.toString();
    const b = rgb.b.toString();
    return luminanceFromRgb(r, g, b);
  }
  return 2;
};

/**
 * Get the contrast ratio between two luminance values
 *
 * @param lum1 The first luminance value
 * @param lum2 The second luminance value
 * @returns
 */
export const getRatioFromLum = (lum1: number, lum2: number) => {
  if (lum1 !== null && lum2 !== null) {
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  } else {
    return -1;
  }
};

/**
 * Get the HSL lightness from a HEX color
 *
 * @param hex A hex color string
 * @returns
 */
export const getHslLightessFromHex = (hex: CssColor) => {
  return chroma(hex).hsl()[2];
};

export const getHslSaturationFromHex = (hex: CssColor) => {
  return chroma(hex).hsl()[1];
};

/**
 * Get the HSLuv lightness from a HEX color
 *
 * @param hex A hex color string
 * @returns
 */
export const getLightnessFromHex = (hex: string) => {
  const conv = new Hsluv();
  conv.hex = hex;
  conv.hexToHsluv();
  return Number(conv.hsluv_l.toFixed(0));
};

/**
 * Get the contrast ratio between two HEX colors
 *
 * @param {CssColor} color1 The first color
 * @param {CssColor} color2 The second color
 * @returns
 */
export const getContrastFromHex = (color1: CssColor, color2: CssColor) => {
  const lum1 = luminanceFromHex(color1);
  const lum2 = luminanceFromHex(color2);
  if (lum1 !== null && lum2 !== null) {
    return getRatioFromLum(lum1, lum2);
  }
  return -1;
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
  const lum1 = luminanceFromHex(lightMainColor as CssColor);
  const lum2 = luminanceFromHex(backgroundColor);
  const ratio = getRatioFromLum(lum1 ?? 0, lum2 ?? 0);

  return ratio;
};

export const lightenDarkColor = (color: CssColor, mode: Mode) => {
  const lightness = getLightnessFromHex(color);

  const conv = new Hsluv();
  conv.hex = color;
  conv.hexToHsluv();
  conv.hsluv_l = lightness < 45 ? getLightnessForDarkMode(color, mode) : conv.hsluv_l;
  conv.hsluv_s = getSaturationForDarkMode(color, conv.hsluv_s);
  conv.hsluvToHex();
  return conv.hex as CssColor;
};

/**
 *
 * @param color The hex color
 * @param uvSat The HSLuv saturation value
 * @returns
 */
const getSaturationForDarkMode = (color: CssColor, hslUvSat: number) => {
  const hslLightness = getHslLightessFromHex(color) * 100;
  if (hslLightness > 35 && hslLightness < 65) {
    if (hslUvSat >= 90) {
      return hslUvSat - 10;
    }
  }
  return hslUvSat;
};

const getLightnessForDarkMode = (color: CssColor, mode: Mode) => {
  const lightness: number = getLightnessFromHex(color);
  if (mode === 'dark') {
    if (lightness >= 23) {
      return mapRange(lightness, 23, 44, 38, 45);
    } else {
      return mapRange(lightness, 0, 23, 28, 38);
    }
  } else {
    if (lightness >= 23) {
      return mapRange(lightness, 23, 44, 28, 35);
    } else {
      return mapRange(lightness, 0, 23, 18, 28);
    }
  }
};

/**
 * Maps the numbers from [start1 - end1] to the range [start2 - end2], maintaining the proportionality between the numbers in the ranges using lineaer interpolation.
 */
const mapRange = (value: number, start1: number, end1: number, start2: number, end2: number) => {
  return start2 + ((value - start1) * (end2 - start2)) / (end1 - start1);
};

/**
 * Check if two colors have enough contrast to be used together
 *
 * @param {CssColor} color1 The first color
 * @param {CssColor} color2 The second color
 * @returns {boolean} If the colors have enough contrast
 */
export const areColorsContrasting = (color1: CssColor, color2: CssColor, type: 'text' | 'decorative' = 'text') => {
  const contrast = getContrastFromHex(color1, color2);
  if (contrast !== null) {
    if (type === 'text') {
      return contrast >= 4.5;
    } else {
      return contrast >= 3;
    }
  }
  return false;
};

/**
 * Check if aa string value is a HEX color
 *
 * @param {string} hex The string to check
 * @returns {boolean} If the string is a HEX color
 */
export const isHexColor = (hex: string) => {
  return typeof hex === 'string' && hex.length === 6 && !isNaN(Number('0x' + hex));
};
