import chroma from 'chroma-js';
import { describe, expect, it } from 'vitest';
import { generateColorScale, generateColorSchemes } from './scale.ts';
import { semanticColorNames, semanticColorSpec } from './specs.ts';
import type { CssColor } from './types.ts';
import { getContrastFromHex } from './utils.ts';

const BASE_COLOR = '#0062BA';
const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

describe('generateColorScale', () => {
  it('returns a record with every semantic color name', () => {
    const scale = generateColorScale(BASE_COLOR, 'light');
    expect(Object.keys(scale)).toEqual(semanticColorNames);
  });

  it('gives every color a valid hex and metadata matching its key', () => {
    const scale = generateColorScale(BASE_COLOR, 'light');
    for (const [name, color] of Object.entries(scale)) {
      expect(color.hex).toMatch(HEX_PATTERN);
      expect(color.name).toBe(name);
      expect(color.number).toBe(semanticColorSpec[name as keyof typeof semanticColorSpec].number);
    }
  });

  it('uses the input color as base-default in light scheme', () => {
    const scale = generateColorScale(BASE_COLOR, 'light');
    expect(scale['base-default'].hex).toBe(BASE_COLOR);
  });

  it('produces a different base-default in dark scheme', () => {
    const light = generateColorScale(BASE_COLOR, 'light');
    const dark = generateColorScale(BASE_COLOR, 'dark');
    expect(dark['base-default'].hex).not.toBe(light['base-default'].hex);
  });

  it('uses pure white or black for base-contrast-default', () => {
    const scale = generateColorScale(BASE_COLOR, 'light');
    expect(['#ffffff', '#000000']).toContain(scale['base-contrast-default'].hex);
  });

  it('is deterministic', () => {
    expect(generateColorScale(BASE_COLOR, 'dark')).toEqual(generateColorScale(BASE_COLOR, 'dark'));
  });
});

describe('minContrast', () => {
  // 24 hues × 6 lightness levels × 3 chroma levels in OKLCH, plus a few fixed colors
  const sampleColors: CssColor[] = [];
  for (let hue = 0; hue < 360; hue += 15) {
    for (const lightness of [0.25, 0.4, 0.5, 0.6, 0.75, 0.9]) {
      for (const chromaValue of [0.03, 0.12, 0.25]) {
        sampleColors.push(chroma.oklch(lightness, chromaValue, hue).hex() as CssColor);
      }
    }
  }
  sampleColors.push('#0062BA', '#C01B1B', '#068718', '#EA9B1B', '#1E2B3C', '#ffffff', '#000000', '#808080');

  it.each(['light', 'dark'] as const)('every generated %s scale meets the minimum contrast in the spec', (scheme) => {
    const failures = new Set<string>();
    for (const color of sampleColors) {
      const scale = generateColorScale(color, scheme);
      for (const step of Object.values(semanticColorSpec)) {
        for (const { ratio, against } of step.minContrast ?? []) {
          for (const other of against) {
            if (getContrastFromHex(scale[step.name].hex, scale[other].hex) < ratio) {
              failures.add(`${color}: ${step.name} vs ${other}`);
            }
          }
        }
      }
    }
    expect([...failures]).toEqual([]);
  });
});

describe('generateColorSchemes', () => {
  it('returns light and dark scales for the color', () => {
    const schemes = generateColorSchemes(BASE_COLOR);
    expect(schemes.light).toEqual(generateColorScale(BASE_COLOR, 'light'));
    expect(schemes.dark).toEqual(generateColorScale(BASE_COLOR, 'dark'));
  });
});
