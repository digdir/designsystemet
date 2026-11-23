import { beforeAll, describe, expect, it, vi } from 'vitest';
import { configSchema } from '../schemas/schema.ts';
import { createTokens, getTokenSetDimensions } from './create.ts';
import { formatThemeCSS } from './format.ts';
import type { Theme, TokenSets } from './types.ts';

const fontSizeTokens = (tokenSets: TokenSets, mode: string) => {
  const tokens = tokenSets.get(`primitives/modes/typography/size/${mode}`) as unknown as {
    'font-size': Record<string, { $value: string }>;
  };
  return Object.fromEntries(Object.entries(tokens['font-size']).map(([key, token]) => [key, Number(token.$value)]));
};

/**
 * Computes `--ds-font-size-<n>` in px the way a browser would for a size mode, from the generated CSS:
 * `round(<rem> * 16 * --ds-size-mode-font-size--<mode> / (--ds-size-base / 16))`.
 */
const cssFontSizes = (css: string, mode: string) => {
  const modeFontSize = Number(css.match(new RegExp(`--ds-size-mode-font-size--${mode}: ([\\d.]+);`))?.[1]);
  const base = Number(css.match(/--ds-size-base: ([\d.]+);/)?.[1]);
  const factor = modeFontSize / (base / 16);
  return Object.fromEntries(
    [...css.matchAll(/--ds-font-size-(\d+): calc\(([\d.]+)rem \* var\(--_ds-font-size-factor\)\);/g)].map(
      ([, key, rem]) => [key, Math.round(Number(rem) * 16 * factor)],
    ),
  );
};

/**
 * Figma reads the font-size tokens of each size mode, while the CSS scales the default size mode's font sizes.
 * Both must give the same font sizes (#5609).
 */
describe('font sizes in Figma and CSS', () => {
  let tokenSets: TokenSets;
  let css: string;

  beforeAll(async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const config = configSchema.parse({
      themes: { test: { colors: { neutral: '#444444', brand: '#0062BA' } } },
    });
    const theme = { name: 'test', ...config.themes?.test } as Theme;

    ({ tokenSets } = await createTokens(theme, getTokenSetDimensions(theme)));
    css = (await formatThemeCSS(theme, { verbose: false, tailwind: false })).map((file) => file.output).join('\n');
  });

  it.each([
    ['small', 'sm'],
    ['medium', 'md'],
    ['large', 'lg'],
  ])('match in the %s size mode', (mode, cssMode) => {
    expect(cssFontSizes(css, cssMode)).toEqual(fontSizeTokens(tokenSets, mode));
  });
});
