import chroma from 'chroma-js';
import { Hsluv } from 'hsluv';
import type { ColorNumber, CssColor } from './types.js';

/**
 * Converts a HEX color '#xxxxxx' into a CSS HSL string 'hsl(x,x,x)'
 *
 * @param hex A hex color string
 * @param valuesOnly If true, only the values are returned
 * @returns A CSS HSL string
 */
export const hexToCssHsl = (hex: string, valuesOnly = false) => {
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
export const hexToHSL = (hex: string) => {
  const [h, s, l] = chroma(hex).hsl();
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
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
  return chroma.hsl(h, s / 100, l / 100).hex();
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
export const getContrastFromHex = (color1: CssColor, color2: CssColor) => {
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
 * Get the HSLuv lightness from a HEX color
 *
 * @param hex The hex color
 */
export const getLightnessFromHex = (hex: string) => {
  const conv = new Hsluv();
  conv.hex = hex;
  conv.hexToHsluv();

  return conv.hsluv_l;
};

/**
 *
 * This function returns the color number based on the color name.
 *
 * @param name The name of the color
 */
export const getColorNumberFromName = (name: string): ColorNumber => {
  const colorMap: Record<string, ColorNumber> = {
    'Background Default': 1,
    'Background Tinted': 2,
    'Surface Default': 3,
    'Surface Tinted': 4,
    'Surface Hover': 5,
    'Surface Active': 6,
    'Border Subtle': 7,
    'Border Default': 8,
    'Border Strong': 9,
    'Text Subtle': 10,
    'Text Default': 11,
    'Base Default': 12,
    'Base Hover': 13,
    'Base Active': 14,
    'Contrast Subtle': 15,
    'Contrast Default': 16,
  };
  return colorMap[name];
};

export const getColorInfoFromPosition = (position: ColorNumber) => {
  const colorMap = {
    1: {
      name: 'backgroundDefault',
      displayName: 'Background Default',
      group: 'background',
    },
    2: {
      name: 'backgroundTinted',
      displayName: 'Background Tinted',
      group: 'background',
    },
    3: {
      name: 'surfaceDefault',
      displayName: 'Surface Default',
      group: 'surface',
    },
    4: {
      name: 'surfaceTinted',
      displayName: 'Surface Tinted',
      group: 'surface',
    },
    5: {
      name: 'surfaceHover',
      displayName: 'Surface Hover',
      group: 'surface',
    },
    6: {
      name: 'surfaceActive',
      displayName: 'Surface Active',
      group: 'surface',
    },
    7: {
      name: 'borderSubtle',
      displayName: 'Border Subtle',
      group: 'border',
    },
    8: {
      name: 'borderDefault',
      displayName: 'Border Default',
      group: 'border',
    },
    9: {
      name: 'borderStrong',
      displayName: 'Border Strong',
      group: 'border',
    },
    10: {
      name: 'textSubtle',
      displayName: 'Text Subtle',
      group: 'text',
    },
    11: {
      name: 'textDefault',
      displayName: 'Text Default',
      group: 'text',
    },
    12: {
      name: 'baseDefault',
      displayName: 'Base Default',
      group: 'base',
    },
    13: {
      name: 'baseHover',
      displayName: 'Base Hover',
      group: 'base',
    },
    14: {
      name: 'baseActive',
      displayName: 'Base Active',
      group: 'base',
    },
    15: {
      name: 'contrastSubtle',
      displayName: 'Contrast Subtle',
      group: 'base',
    },
    16: {
      name: 'contrastDefault',
      displayName: 'Contrast Default',
      group: 'base',
    },
  } as const;
  return colorMap[position];
};

/**
 * This function returns the color name based on the color number.
 *
 * @param number The number of the color
 */
export const getColorNameFromNumber = (number: ColorNumber): string => {
  const colorMap: { [key in ColorNumber]: string } = {
    1: 'Background Default',
    2: 'Background Tinted',
    3: 'Surface Default',
    4: 'Surface Tinted',
    5: 'Surface Hover',
    6: 'Surface Active',
    7: 'Border Subtle',
    8: 'Border Default',
    9: 'Border Strong',
    10: 'Text Subtle',
    11: 'Text Default',
    12: 'Base Default',
    13: 'Base Hover',
    14: 'Base Active',
    15: 'Contrast Subtle',
    16: 'Contrast Default',
  };
  return colorMap[number];
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
export const convertToHex = (color?: string): CssColor => {
  if (!color) {
    return '#000000';
  }
  if (color.startsWith('#')) {
    return color as CssColor;
  }
  return chroma(color).hex() as CssColor;
};

export const rgbToHex = (rgb: { r: number; g: number; b: number }) => {
  return (
    '#' +
    [rgb.r, rgb.g, rgb.b]
      .map((x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};
