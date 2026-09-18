import { describe, expect, it } from 'vitest';
import { generateColorScale, generateColorSchemes, getCssVariable } from './scale.ts';
import { semanticColorNames, semanticColorSpec } from './specs.ts';

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

describe('generateColorSchemes', () => {
  it('returns light and dark scales for the color', () => {
    const schemes = generateColorSchemes(BASE_COLOR);
    expect(schemes.light).toEqual(generateColorScale(BASE_COLOR, 'light'));
    expect(schemes.dark).toEqual(generateColorScale(BASE_COLOR, 'dark'));
  });
});

describe('getCssVariable', () => {
  it('builds the variable name from color type and number', () => {
    expect(getCssVariable('accent', 1)).toBe('--ds-color-accent-background-default');
    expect(getCssVariable('neutral', 12)).toBe('--ds-color-neutral-base-default');
  });
});
