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
    const { config, warnings } = configFromCss(css, 'designsystemet (1).css');

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
    const { config, warnings } = configFromCss(css);

    expect(Object.keys(JSON.parse(config).themes)).toEqual(['theme']);
    expect(warnings).toEqual([
      `The CSS doesn't name its theme, so it's called "theme". Rename it in the config before importing if needed.`,
    ]);
  });
});
