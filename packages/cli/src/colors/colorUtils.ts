import type { CssColor } from '@adobe/leonardo-contrast-colors';
import { APCAcontrast, sRGBtoY } from 'apca-w3';
import chroma from 'chroma-js';
import { Hsluv } from 'hsluv';

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
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
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
  let r = 0;
  let g = 0;
  let b = 0;
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
  let h = 0;
  let s = 0;
  let l = 0;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;

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
 * Converts a HEX color '#xxxxxx' into an array of HSLuv values '[h,s,l]'
 *
 * @param hex A hex color string
 * @returns
 */
export const hexToHsluv = (hex: string) => {
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
export const HSLToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;

  let r = 0;
  let g = 0;
  let b = 0;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

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
  hex = hex.replace(shorthandRegex, (m, r: string, g: string, b: string) => r + r + g + g + b + b);

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
  const a = [Number(r), Number(g), Number(b)].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
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
  }
  return -1;
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

/**
 * Maps the numbers from [start1 - end1] to the range [start2 - end2], maintaining the proportionality between the numbers in the ranges using lineaer interpolation.
 */
// const mapRange = (value: number, start1: number, end1: number, start2: number, end2: number) => {
//   return start2 + ((value - start1) * (end2 - start2)) / (end1 - start1);
// };

/**
 * Check if two colors have enough contrast to be used together
 *
 * @param {CssColor} color1 The first color
 * @param {CssColor} color2 The second color
 * @returns {boolean} If the colors have enough contrast
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

export const getApcaContrastLc = (textColor: CssColor, backgroundColor: CssColor) => {
  const textColorRgb = hexToRgb(textColor);
  const backgroundColorRgb = hexToRgb(backgroundColor);

  if (textColorRgb && backgroundColorRgb) {
    return APCAcontrast(
      sRGBtoY([textColorRgb.r, textColorRgb.g, textColorRgb.b]),
      sRGBtoY([backgroundColorRgb.r, backgroundColorRgb.g, backgroundColorRgb.b]),
    );
  }
  return 0;
};

/**
 * Check if aa string value is a HEX color
 *
 * @param {string} hex The string to check
 * @returns {boolean} If the string is a HEX color
 */
export const isHexColor = (hex: string) => {
  return typeof hex === 'string' && hex.length === 6 && !Number.isNaN(Number('0x' + hex));
};
