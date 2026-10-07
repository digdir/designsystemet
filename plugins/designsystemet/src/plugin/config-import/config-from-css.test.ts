/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { configFromCss } from './config-from-css';

// The theme CSS that `tokens build` creates from the repository's designsystemet.config.json.
// Read from disk, as Vitest leaves CSS imports empty.
const css = readFileSync(
  new URL(
    '../../../../../packages/css/theme/designsystemet.css',
    import.meta.url,
  ),
  'utf8',
);

describe('configFromCss', () => {
  it('names the theme after the uploaded file', () => {
    const { config, warnings } = configFromCss([
      { css, fileName: 'designsystemet (1).css' },
    ]);

    expect(JSON.parse(config)).toMatchObject({
      $schema: expect.stringContaining('https://designsystemet.no/schemas/'),
      themes: {
        designsystemet: {
          colors: {
            accent: '#0062BA',
            brand1: '#0D7A5F',
            brand2: '#5B3FA0',
            neutral: '#24272B',
          },
        },
      },
    });
    expect(warnings).toEqual([]);
  });

  it('gives pasted CSS a theme name to change', () => {
    const { config, warnings } = configFromCss([{ css }]);

    expect(Object.keys(JSON.parse(config).themes)).toEqual(['theme']);
    expect(warnings).toEqual([
      `The CSS doesn't name its theme, so it's called "theme". Rename it in the config before importing if needed.`,
    ]);
  });

  it('makes each file a theme, in the order of the files', () => {
    const { config } = configFromCss([
      { css, fileName: 'light-brand.css' },
      { css, fileName: 'dark-brand.css' },
    ]);

    expect(Object.keys(JSON.parse(config).themes)).toEqual([
      'light-brand',
      'dark-brand',
    ]);
  });

  it('throws when two files name the same theme', () => {
    expect(() =>
      configFromCss([
        { css, fileName: 'designsystemet.css' },
        { css, fileName: 'designsystemet (1).css' },
      ]),
    ).toThrow('More than one file is named for the theme "designsystemet".');
  });
});
