import { beforeAll, describe, expect, it, vi } from 'vitest';
import { configSchema } from '../schemas/schema.ts';
import { createTokens, getColorNames, getTokenSetDimensions } from './create.ts';
import { formatThemeCSS } from './format.ts';
import type { Theme, TokenSet } from './types.ts';

// Theme "b" has no brand color, which theme "a" has.
const config = configSchema.parse({
  themes: {
    a: { colors: { accent: '#0062ba', brand: '#5b3fa0', neutral: '#24272b' } },
    b: { colors: { accent: '#0d7a5f', neutral: '#1e2b3c' } },
  },
});
const themes = config.themes ?? {};
const theme = (name: string) => ({ name, ...themes[name] }) as Theme;

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('getColorNames', () => {
  it('lists every color across the themes, with the severity colors last', () => {
    expect(getColorNames(themes)).toEqual(['accent', 'brand', 'neutral', 'info', 'success', 'warning', 'danger']);
  });
});

describe('createTokens with themes that have different colors', () => {
  it("uses the theme's first color for a color it doesn't have", async () => {
    const b = theme('b');
    const { tokenSets } = await createTokens(b, getTokenSetDimensions(b), getColorNames(themes));

    const themeColors = (tokenSets.get('themes/b') as { color: Record<string, TokenSet> }).color;
    expect(themeColors.brand).toEqual(themeColors.accent);
    expect(themeColors.accent['1']).toEqual({ $type: 'color', $value: '{b.accent.1}' });
    // The shared sets have every color, so b can use data-color="brand" like a.
    expect(tokenSets.has('semantic/color/brand')).toBe(true);
    // b gets no brand scale of its own, only the scales of its own colors.
    const lightScales = tokenSets.get('primitives/modes/color-scheme/light/b');
    expect(lightScales).toHaveProperty('b.accent');
    expect(lightScales).not.toHaveProperty('b.brand');
  });

  it("uses the theme's own colors when no other colors are given", async () => {
    const b = theme('b');
    const { tokenSets } = await createTokens(b, getTokenSetDimensions(b));

    expect(tokenSets.has('semantic/color/brand')).toBe(false);
  });
});

describe('formatThemeCSS with themes that have different colors', () => {
  let css: string;

  beforeAll(async () => {
    const files = await formatThemeCSS(theme('b'), { verbose: false, tailwind: false }, getColorNames(themes));
    css = files.map((file) => file.output).join('\n');
  }, 30_000);

  it("gives a color the theme doesn't have the values of its first color", () => {
    const value = (name: string) => new RegExp(`${name}:\\s*([^;]+);`).exec(css)?.[1];

    expect(value('--ds-color-brand-background-tinted')).toBeDefined();
    expect(value('--ds-color-brand-background-tinted')).toBe(value('--ds-color-accent-background-tinted'));
    expect(value('--ds-color-brand-base-default')).toBe(value('--ds-color-accent-base-default'));
    expect(css).toContain('[data-color="brand"]');
  });
});
