import { describe, expect, it } from 'vitest';
import {
  convertColor,
  convertToHex,
  getContrastFromHex,
  getLightnessFromHex,
  getLuminanceFromLightness,
} from './utils.ts';

describe('getContrastFromHex', () => {
  it('returns 21 for black on white', () => {
    expect(getContrastFromHex('#ffffff', '#000000')).toBeCloseTo(21);
  });

  it('returns 1 for identical colors', () => {
    expect(getContrastFromHex('#1a589f', '#1a589f')).toBeCloseTo(1);
  });

  it('is symmetric', () => {
    expect(getContrastFromHex('#1a589f', '#fa782d')).toBeCloseTo(getContrastFromHex('#fa782d', '#1a589f'));
  });
});

describe('getLightnessFromHex', () => {
  it('returns 0 for black and 100 for white', () => {
    expect(getLightnessFromHex('#000000')).toBeCloseTo(0);
    expect(getLightnessFromHex('#ffffff')).toBeCloseTo(100);
  });
});

describe('getLuminanceFromLightness', () => {
  it('maps the lightness extremes to relative luminance extremes', () => {
    expect(getLuminanceFromLightness(0)).toBeCloseTo(0);
    expect(getLuminanceFromLightness(100)).toBeCloseTo(1);
  });

  it('increases monotonically with lightness', () => {
    expect(getLuminanceFromLightness(30)).toBeLessThan(getLuminanceFromLightness(60));
  });
});

describe('convertToHex', () => {
  it('defaults to black for missing color', () => {
    expect(convertToHex(undefined)).toBe('#000000');
    expect(convertToHex('')).toBe('#000000');
  });

  it('passes 6-digit hex colors through unchanged', () => {
    expect(convertToHex('#1A589F')).toBe('#1A589F');
  });

  it('normalizes other color formats to 6-digit hex', () => {
    expect(convertToHex('red')).toBe('#ff0000');
    expect(convertToHex('#abc')).toBe('#aabbcc');
    expect(convertToHex('rgb(255, 0, 0)')).toBe('#ff0000');
  });
});

describe('convertColor', () => {
  it('formats rgb with 0-255 coordinates', () => {
    expect(convertColor('#ff0000', 'rgb')).toBe('rgb(255 0 0)');
  });

  it('formats hex', () => {
    expect(convertColor('rgb(255 0 0)', 'hex')).toBe('#f00');
  });

  it('converts to other color spaces', () => {
    expect(convertColor('#ff0000', 'oklch')).toMatch(/^oklch\(/);
    expect(convertColor('#ff0000', 'hct')).toBe('hct(27.4 113 53.2)');
  });
});
