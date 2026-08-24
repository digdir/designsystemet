import { describe, expect, it } from 'vitest';
import { type CssColor, generateColorScale } from '../../../../colors/index.ts';
import { visitedLinkColor } from '../../../../schemas/defaults.ts';
import type { ColorOverrideSchema } from '../../../../schemas/v1.1/schema.ts';
import { generateColorScheme, groupByScheme } from './color-scheme.ts';

const NEUTRAL: CssColor = '#444444';
const ACCENT: CssColor = '#0062BA';

describe('groupByScheme', () => {
  const colors: Record<string, Record<string, Record<string, CssColor>>> = {
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

describe('generateColorScheme', () => {
  const baseColors = { neutral: NEUTRAL, accent: ACCENT };

  it('nests token sets for each color under the theme name', () => {
    const result = generateColorScheme('theme', 'light', baseColors);
    const theme = result.theme as Record<string, Record<number, { $type: string; $value: string }>>;

    expect(Object.keys(result)).toEqual(['theme']);
    expect(Object.keys(theme.accent).map(Number)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
    expect(theme.accent[12]).toEqual({ $type: 'color', $value: ACCENT });
  });

  it('defaults focus tokens to neutral positions 1 and 11', () => {
    const result = generateColorScheme('theme', 'light', baseColors);
    const theme = result.theme as Record<string, Record<string, { $value: string }>>;
    const neutralScale = generateColorScale(NEUTRAL, 'light');

    expect(theme.focus.inner.$value).toBe(neutralScale['background-default'].hex);
    expect(theme.focus.outer.$value).toBe(neutralScale['text-default'].hex);
  });

  it('defaults link.visited to the visited-link scale position 12', () => {
    const result = generateColorScheme('theme', 'light', baseColors);
    const theme = result.theme as Record<string, Record<string, { $value: string }>>;

    expect(theme.link.visited.$value).toBe(generateColorScale(visitedLinkColor, 'light')['base-default'].hex);
  });

  it('generates scales from severity override hexes', () => {
    const overrides = { severity: { danger: '#AA0000' } } as ColorOverrideSchema;
    const result = generateColorScheme('theme', 'light', baseColors, overrides);
    const theme = result.theme as Record<string, Record<number, { $value: string }>>;

    // Position 12 is base-default for colors, so it should match the override
    expect(theme.danger[12].$value).toBe(overrides?.severity?.danger);
  });

  it('generates scales from severity defined in colors', () => {
    const colors = { ...{ info: '#ff00e1' as CssColor }, ...baseColors };
    const result = generateColorScheme('theme', 'light', colors);
    const theme = result.theme as Record<string, Record<number, { $value: string }>>;

    // Position 12 is base-default for colors
    expect(theme.info[12].$value).toBe(colors?.info);
  });

  it('severity color defined in overrides takes precedent over color', () => {
    const overrides = { severity: { info: '#AA0000' } } as ColorOverrideSchema;
    const colors = { ...{ info: '#ff00e1' as CssColor }, ...baseColors };
    const result = generateColorScheme('theme', 'light', colors, overrides);
    const theme = result.theme as Record<string, Record<number, { $value: string }>>;

    // Position 12 is base-default for colors
    expect(theme.info[12].$value).toBe(overrides?.severity?.info);
  });

  it('applies color overrides for the matching scheme only', () => {
    const overrides = {
      colors: { accent: { 'background-default': { light: '#111111' } } },
    } as ColorOverrideSchema;

    const light = generateColorScheme('theme', 'light', baseColors, overrides).theme as Record<
      string,
      Record<number, { $value: string }>
    >;
    const dark = generateColorScheme('theme', 'dark', baseColors, overrides).theme as Record<
      string,
      Record<number, { $value: string }>
    >;

    expect(light.accent[1].$value).toBe('#111111');
    expect(dark.accent[1].$value).toBe(generateColorScale(ACCENT, 'dark')['background-default'].hex);
  });

  it('lets linkVisited and focus overrides win over the defaults', () => {
    const overrides = {
      linkVisited: { light: '#123456' },
      focus: { inner: { light: '#222222' }, outer: { light: '#333333' } },
    } as ColorOverrideSchema;
    const result = generateColorScheme('theme', 'light', baseColors, overrides);
    const theme = result.theme as Record<string, Record<string, { $value: string }>>;

    expect(theme.link.visited.$value).toBe('#123456');
    expect(theme.focus.inner.$value).toBe('#222222');
    expect(theme.focus.outer.$value).toBe('#333333');
  });
});
