import { describe, expect, it } from 'vitest';
import { type ConfigSchemaThemeInput, configSchema, themesSchema } from './schema.ts';

const baseTheme: ConfigSchemaThemeInput = {
  colors: { neutral: '#444444', accent: '#0062BA' },
  typography: {
    fontFamily: 'Arial',
  },
  borderRadius: 8,
};

// A font-size scale with the keys (1-10) referenced by the default typography components.
const fontSizeScale = (start: number) =>
  Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), String(index + start)]));
// Use safeParse to validate themes without throwing exceptions
const parseThemes = (themes: Record<string, ConfigSchemaThemeInput>) => themesSchema.safeParse(themes);

const issuePaths = (result: ReturnType<typeof parseThemes>) =>
  result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));

describe('themesSchema cross-theme validation', () => {
  it('accepts a single theme', () => {
    expect(parseThemes({ a: baseTheme }).success).toBe(true);
  });

  it('accepts themes that only differ in theme-scoped values', () => {
    const result = parseThemes({
      a: baseTheme,
      b: {
        colors: { neutral: '#222222', accent: '#FF0000' },
        typography: {
          fonts: {
            primary: { fontFamily: 'Comic Sans', fontWeight: { regular: '400', medium: '500', semibold: '600' } },
            secondary: { fontFamily: 'Georgia' },
          },
        },
        // Different base and scale, but the same step names.
        borderRadius: 8,
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects themes with different color names', () => {
    const result = parseThemes({
      a: baseTheme,
      b: { colors: { neutral: '#444444', brand: '#0062BA' } },
    });

    expect(issuePaths(result)).toEqual(['b.colors']);
  });

  it('rejects themes with different size steps', () => {
    const result = parseThemes({
      a: baseTheme,
      b: {
        ...baseTheme,
        size: {
          scale: { '1': 'floor({step} / {base} * {baseFontSize} * 1)' },
          // Only one size step, which has typography values in the default typography.
          steps: {
            small: { base: 18, step: 4, baseFontSize: 16 },
          },
        },
      },
    });

    expect(issuePaths(result)).toEqual(['b.size']);
  });

  it.each<[path: string, override: Partial<ConfigSchemaThemeInput>]>([
    ['shadow', { shadow: { xs: [], sm: [], md: [], lg: [], xl: [] } }],
    ['borderWidth', { borderWidth: { default: '2px', focus: '3px' } }],
    ['opacity', { opacity: { disabled: '50%' } }],
  ])('rejects themes with different %s', (path, override) => {
    const result = parseThemes({ a: baseTheme, b: { ...baseTheme, ...override } });

    expect(issuePaths(result)).toEqual([`b.${path}`]);
  });

  it('rejects themes with different border-radius step names', () => {
    const result = parseThemes({
      a: baseTheme,
      b: { ...baseTheme, borderRadius: { base: 4, scale: 4, steps: { sm: '{base}', lg: '{base}*2' } } },
    });

    expect(issuePaths(result)).toEqual(['b.borderRadius.steps']);
  });

  it('rejects themes with different typography set names', () => {
    const result = parseThemes({
      a: baseTheme,
      b: { ...baseTheme, typography: { fonts: { primary: {}, tertiary: {} } } },
    });

    expect(issuePaths(result)).toEqual(['b.typography.fonts']);
  });

  it('rejects themes with different shared typography values', () => {
    const result = parseThemes({
      a: baseTheme,
      b: {
        ...baseTheme,
        typography: {
          size: {
            small: { lineHeight: { sm: '120%', md: '140%', lg: '160%' }, fontSize: fontSizeScale(11) },
            medium: { letterSpacing: { '1': '-2%' }, fontSize: fontSizeScale(12) },
            large: { fontSize: fontSizeScale(13) },
          },
          components: { heading: { xl: { fontWeight: '{font-weight.semibold}' } } },
        },
      },
    });

    expect(issuePaths(result)).toEqual(['b.typography.size', 'b.typography.components']);
  });

  it('reports which theme does not match the first theme', () => {
    const result = parseThemes({ a: baseTheme, b: { ...baseTheme, opacity: { disabled: '50%' } } });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      'All themes must define the same opacities, as they are shared by all themes. Theme "b" does not match theme "a".',
    );
  });
});

describe('themeSchema typography validation', () => {
  it('rejects a size step without typography values', () => {
    const result = parseThemes({
      a: {
        ...baseTheme,
        size: {
          scale: { '1': 'floor({step} / {base} * {baseFontSize} * 1)' },
          steps: { compact: { base: 18, step: 4, baseFontSize: 14 } },
        },
      },
    });

    expect(issuePaths(result)).toEqual(['a.typography.size']);
  });

  it('accepts a custom size step with matching typography values', () => {
    const result = parseThemes({
      a: {
        ...baseTheme,
        size: {
          scale: { '1': 'floor({step} / {base} * {baseFontSize} * 1)' },
          steps: { compact: { base: 18, step: 4, baseFontSize: 14 } },
        },
        typography: {
          size: { compact: { fontSize: fontSizeScale(10) } },
        },
      },
    });

    expect(issuePaths(result)).toEqual([]);
  });

  it('rejects component references to font-sizes missing from a size step', () => {
    const result = parseThemes({
      a: {
        ...baseTheme,
        typography: {
          size: {
            small: { fontSize: fontSizeScale(11) },
            medium: { fontSize: fontSizeScale(12) },
            // Missing font-size 9 and 10 in one mode, so components may not reference them.
            large: { fontSize: Object.fromEntries(Object.entries(fontSizeScale(13)).slice(0, 8)) },
          },
          components: { heading: { xl: { fontSize: '{font-size.9}' } } },
        },
      },
    });

    expect(result.success).toBe(false);
  });
});

describe('internal schema tests', () => {
  it('validates simple v1.1 schema', () => {
    const result = configSchema.safeParse({
      themes: { a: baseTheme },
    });
    expect(result.success).toBe(true);
  });
});
