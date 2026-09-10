import { describe, expect, it } from 'vitest';
import { type ConfigSchemaThemeInput, configSchema, themesSchema } from './schema.ts';

const baseTheme: ConfigSchemaThemeInput = {
  colors: { neutral: '#444444', accent: '#0062BA' },
  typography: {
    fontFamily: 'Arial',
  },
  borderRadius: 8,
};

// The font-size scale keys (1-10) referenced by the default typography components.
const fontSizes = Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), String(index + 11)]));
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
          primary: { fontFamily: 'Comic Sans', fontWeight: { regular: '400', medium: '500', semibold: '600' } },
          secondary: { fontFamily: 'Georgia' },
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
          // Only one size step, with the font-size keys the default typography components reference.
          steps: {
            small: { base: 18, step: 4, baseFontSize: 16, fontSizes: fontSizes },
          },
        },
      },
    });

    expect(issuePaths(result)).toEqual(['b.size']);
  });

  it.each<[path: string, override: Partial<ConfigSchemaThemeInput>]>([
    ['shadow', { shadow: { xs: [], sm: [], md: [], lg: [], xl: [] } }],
    ['border-width', { 'border-width': { default: '2px', focus: '3px' } }],
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
      b: { ...baseTheme, typography: { primary: {}, tertiary: {} } },
    });

    expect(issuePaths(result)).toEqual(['b.typography']);
  });

  it('rejects themes where the first typography set has different shared values', () => {
    const result = parseThemes({
      a: baseTheme,
      b: {
        ...baseTheme,
        typography: {
          primary: {
            lineHeight: { sm: '120%', md: '140%', lg: '160%' },
            letterSpacing: { '1': '-2%' },
            components: { heading: { xl: { fontWeight: '{font-weight.semibold}' } } },
          },
          secondary: {},
        },
      },
    });

    expect(issuePaths(result)).toEqual([
      'b.typography.primary.lineHeight',
      'b.typography.primary.letterSpacing',
      'b.typography.primary.components',
    ]);
  });

  it('reports which theme does not match the first theme', () => {
    const result = parseThemes({ a: baseTheme, b: { ...baseTheme, opacity: { disabled: '50%' } } });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      'All themes must define the same opacities, as they are shared by all themes. Theme "b" does not match theme "a".',
    );
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
