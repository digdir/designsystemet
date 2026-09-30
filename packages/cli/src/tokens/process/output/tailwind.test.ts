import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { configSchema } from '../../../schemas/schema.ts';
import { formatThemeCSS } from '../../format.ts';
import type { OutputFile, Theme } from '../../types.ts';
import { createTailwindCSSFiles, type TailwindVersion } from './tailwind.ts';

// The `@theme` (v3) or `@theme inline` (v4) block, and the variable declarations in it,
// e.g. `  --color-text-default: var(--ds-color-text-default);`
const THEME_BLOCK = /^@theme(?: inline)? \{([^}]*)\}/;
const THEME_VARIABLE = /^\s*(--[a-z0-9-]+): var\((--ds-[a-z0-9-]+)\);$/gm;

const themeCSS = `
:root {
  --ds-font-family: 'Inter';
  --ds-color-text-default: #000;
  --ds-color-accent-base-default: #0062ba;
  --ds-color-focus-inner: #fff;
  --ds-opacity-disabled: 30%;
  --ds-shadow-md: 0 0 1px #000;
  --ds-font-weight-medium: 500;
  --ds-border-radius-md: 4px;
  --ds-border-radius-full: 9999px;
  --ds-size-4: 1rem;
  --ds-size-mode-font-size: 18;
}
`;

const generate = (version: TailwindVersion, files: OutputFile[] = [{ destination: 'theme.css', output: themeCSS }]) =>
  createTailwindCSSFiles(files, version);

const themeVariables = (output: string) =>
  Object.fromEntries(
    [...(output.match(THEME_BLOCK)?.[1] ?? '').matchAll(THEME_VARIABLE)].map(([, name, token]) => [name, token]),
  );

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('createTailwindCSSFiles', () => {
  it('writes a .tailwind.css file next to each theme file', () => {
    const files = generate('v4', [
      { destination: 'a.css', output: themeCSS },
      { destination: 'b.css', output: themeCSS },
    ]);

    expect(files.map((file) => file.destination)).toEqual(['a.tailwind.css', 'b.tailwind.css']);
  });

  it('skips files without a destination', () => {
    expect(generate('v4', [{ output: themeCSS } as OutputFile])).toEqual([]);
  });

  it.each(['v3', 'v4'] as const)('maps design tokens to Tailwind theme variables (%s)', (version) => {
    const [file] = generate(version);

    expect(themeVariables(file.output)).toEqual({
      '--font-sans': '--ds-font-family',
      '--color-text-default': '--ds-color-text-default',
      '--color-accent-base-default': '--ds-color-accent-base-default',
      '--opacity-disabled': '--ds-opacity-disabled',
      '--shadow-md': '--ds-shadow-md',
      '--font-weight-medium': '--ds-font-weight-medium',
      '--radius-md': '--ds-border-radius-md',
      '--spacing-4': '--ds-size-4',
    });
  });

  it('uses @theme inline for v4, so utilities follow data attributes without a [data-color] block', () => {
    const [file] = generate('v4');

    expect(file.output.startsWith('@theme inline {')).toBe(true);
    expect(file.output).not.toContain('[data-color]');
  });

  it('uses @theme and a [data-color] block for v3', () => {
    const [file] = generate('v3');

    expect(file.output.startsWith('@theme {')).toBe(true);
    expect(file.output).toContain('[data-color] {');
  });
});

/**
 * Builds a theme end to end, so the Tailwind file is checked against the CSS variables the theme actually declares.
 * A token renamed in the CSS without updating the Tailwind mapping fails here.
 */
describe.each(['v3', 'v4'] as const)('Tailwind %s file for a generated theme', (version) => {
  let css: string;
  let tailwind: string;

  beforeAll(async () => {
    const config = configSchema.parse({
      themes: { test: { colors: { neutral: '#444444', brand: '#0062BA' } } },
    });
    const theme = { name: 'test', ...config.themes?.test } as Theme;

    const files = await formatThemeCSS(theme, { verbose: false, tailwind: version });
    css = files
      .filter((file) => !file.destination?.endsWith('.tailwind.css'))
      .map((file) => file.output)
      .join('\n');
    tailwind = files.find((file) => file.destination?.endsWith('.tailwind.css'))?.output ?? '';
  });

  it('is generated', () => {
    expect(tailwind).not.toBe('');
  });

  it('only references CSS variables that the theme declares', () => {
    const referenced = Object.values(themeVariables(tailwind));

    expect(referenced.length).toBeGreaterThan(0);
    for (const token of referenced) {
      expect(css, `${token} is not declared by the theme CSS`).toMatch(new RegExp(`${token}\\s*:`));
    }
  });
});
