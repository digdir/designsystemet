import { describe, expect, it } from 'vitest';
import { type CssColor, generateColorScale, semanticColorSpec } from '../../../../colors/index.ts';
import { visitedLinkColor } from '../../../../schemas/defaults.ts';
import { colorsSchema } from '../../../../schemas/schema-color.ts';
import type { ColorOverrideSchema } from '../../../../schemas/schema-overrides.ts';
import { generateColorScheme, getThemeColorScales, groupByScheme } from './color-scheme.ts';

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

  it('severity color defined in overrides takes precedence over color', () => {
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

describe('getThemeColorScales', () => {
  const NEUTRAL: CssColor = '#444444';
  const ACCENT: CssColor = '#0062BA';
  // Parsed like a validated config, which adds the default severity colors.
  const colors = colorsSchema.parse({ neutral: NEUTRAL, accent: ACCENT });

  it('includes the severity colors after the theme colors', () => {
    const scales = getThemeColorScales({ colors }, 'light');

    expect(Object.keys(scales)).toEqual(['neutral', 'accent', 'info', 'success', 'warning', 'danger']);
    expect(scales.accent).toEqual(generateColorScale(ACCENT, 'light'));
  });

  it('applies severity overrides', () => {
    const scales = getThemeColorScales({ colors, overrides: { severity: { danger: '#FF0000' } } }, 'dark');

    expect(scales.danger).toEqual(generateColorScale('#FF0000', 'dark'));
  });

  it('applies per-scheme color overrides only to that scheme', () => {
    const overrides: ColorOverrideSchema = { colors: { accent: { 'background-default': { light: '#1A589F' } } } };

    expect(getThemeColorScales({ colors, overrides }, 'light').accent['background-default'].hex).toBe('#1A589F');
    expect(getThemeColorScales({ colors, overrides }, 'dark').accent['background-default'].hex).toBe(
      generateColorScale(ACCENT, 'dark')['background-default'].hex,
    );
  });

  describe('a color as its steps', () => {
    const stepColors = colorsSchema.parse({
      neutral: NEUTRAL,
      accent: {
        'base-default': { light: ACCENT, dark: '#4C91CF' },
        'background-default': { dark: '#000000' },
        'text-subtle': { light: '#111111', dark: '#EEEEEE' },
      },
    });

    it('applies each step to its scheme', () => {
      const light = getThemeColorScales({ colors: stepColors }, 'light').accent;
      const dark = getThemeColorScales({ colors: stepColors }, 'dark').accent;

      expect(light['base-default'].hex).toBe(ACCENT);
      expect(light['text-subtle'].hex).toBe('#111111');
      expect(dark['base-default'].hex).toBe('#4C91CF');
      expect(dark['background-default'].hex).toBe('#000000');
      expect(dark['text-subtle'].hex).toBe('#EEEEEE');
      // A step keeps its spec metadata, like a generated one.
      expect(dark['text-subtle']).toMatchObject({
        name: 'text-subtle',
        number: semanticColorSpec['text-subtle'].number,
      });
    });

    it('generates the steps and schemes it leaves out from the base color', () => {
      for (const scheme of ['light', 'dark'] as const) {
        const scale = getThemeColorScales({ colors: stepColors }, scheme).accent;
        const generated = generateColorScale(ACCENT, scheme);

        expect(scale['surface-default']).toEqual(generated['surface-default']);
        expect(scale['border-strong']).toEqual(generated['border-strong']);
      }
      // background-default only sets dark, so light is generated.
      expect(getThemeColorScales({ colors: stepColors }, 'light').accent['background-default']).toEqual(
        generateColorScale(ACCENT, 'light')['background-default'],
      );
    });

    it('generates the whole scale from base-default in light when it is the only step', () => {
      const onlyBase = colorsSchema.parse({ neutral: NEUTRAL, accent: { 'base-default': { light: ACCENT } } });

      for (const scheme of ['light', 'dark'] as const) {
        expect(getThemeColorScales({ colors: onlyBase }, scheme).accent).toEqual(generateColorScale(ACCENT, scheme));
      }
    });

    it('applies the deprecated color overrides after the steps', () => {
      const overrides: ColorOverrideSchema = {
        colors: { accent: { 'text-subtle': { dark: '#222222' }, 'border-subtle': { dark: '#333333' } } },
      };

      const dark = getThemeColorScales({ colors: stepColors, overrides }, 'dark').accent;

      expect(dark['text-subtle'].hex).toBe('#222222');
      expect(dark['border-subtle'].hex).toBe('#333333');
      expect(dark['background-default'].hex).toBe('#000000');
    });

    it('replaces a severity color with steps by the deprecated severity override', () => {
      const severityColors = colorsSchema.parse({
        neutral: NEUTRAL,
        accent: ACCENT,
        danger: { 'base-default': { light: '#C01B1B' }, 'text-subtle': { light: '#111111' } },
      });

      const light = getThemeColorScales(
        { colors: severityColors, overrides: { severity: { danger: '#FF0000' } } },
        'light',
      );

      expect(light.danger).toEqual(generateColorScale('#FF0000', 'light'));
    });
  });
});
