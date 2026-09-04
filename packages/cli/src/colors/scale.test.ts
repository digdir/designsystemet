import { describe, expect, it } from 'vitest';
import {
  addSeverityColors,
  generateColorScale,
  generateColorSchemes,
  getCssVariable,
  getThemeColorScales,
  groupByScheme,
  type ThemeColorOverrides,
} from './scale.ts';
import { semanticColorNames, semanticColorSpec } from './specs.ts';
import type { CssColor } from './types.ts';

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

describe('addSeverityColors', () => {
  it('appends the default severity colors after the user colors', () => {
    const colors: Record<string, CssColor> = { accent: '#0062BA' };
    expect(Object.keys(addSeverityColors(colors))).toEqual(['accent', 'info', 'success', 'warning', 'danger']);
  });

  it('keeps user-defined severity values but moves them to the end', () => {
    const colors: Record<string, CssColor> = { danger: '#AA0000', accent: '#0062BA' };
    const result = addSeverityColors(colors);
    expect(Object.keys(result)).toEqual(['accent', 'info', 'success', 'warning', 'danger']);
    expect(result.danger).toBe('#AA0000');
  });
});

describe('groupByScheme', () => {
  const colors: ThemeColorOverrides['colors'] = {
    accent: {
      'background-default': { light: '#1A589F', dark: '#171717' },
      'text-default': { light: '#333333' },
    },
  };

  it('picks the hex for the given scheme and attaches spec metadata', () => {
    const grouped = groupByScheme(colors, 'light');
    expect(grouped.accent['background-default']).toMatchObject({
      hex: '#1A589F',
      name: 'background-default',
      number: 1,
    });
  });

  it('drops tokens without a value for the scheme', () => {
    const grouped = groupByScheme(colors, 'dark');
    expect(Object.keys(grouped.accent)).toEqual(['background-default']);
  });
});

describe('getThemeColorScales', () => {
  const NEUTRAL: CssColor = '#444444';
  const ACCENT: CssColor = '#0062BA';
  const colors = { neutral: NEUTRAL, accent: ACCENT };

  it('adds the default severity colors after the theme colors', () => {
    const scales = getThemeColorScales({ colors }, 'light');

    expect(Object.keys(scales)).toEqual(['neutral', 'accent', 'info', 'success', 'warning', 'danger']);
    expect(scales.accent).toEqual(generateColorScale(ACCENT, 'light'));
  });

  it('applies severity overrides', () => {
    const overrides: ThemeColorOverrides = { severity: { danger: '#FF0000' } };
    const scales = getThemeColorScales({ colors, overrides }, 'dark');

    expect(scales.danger).toEqual(generateColorScale('#FF0000', 'dark'));
  });

  it('applies per-scheme color overrides only to that scheme', () => {
    const overrides: ThemeColorOverrides = {
      colors: { accent: { 'background-default': { light: '#1A589F' } } },
    };

    expect(getThemeColorScales({ colors, overrides }, 'light').accent['background-default'].hex).toBe('#1A589F');
    expect(getThemeColorScales({ colors, overrides }, 'dark').accent['background-default'].hex).toBe(
      generateColorScale(ACCENT, 'dark')['background-default'].hex,
    );
  });
});
