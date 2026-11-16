import { describe, expect, it } from 'vitest';
import { importConfig, validateConfig } from './import-config';

const theme = { colors: { neutral: '#1E2B3C', accent: '#0062BA' } };

describe('importConfig', () => {
  it('reads a config and keeps its settings', () => {
    const result = importConfig(
      JSON.stringify({
        outDir: './tokens',
        themes: { one: theme, two: theme },
      }),
    );
    if (!('config' in result)) throw new Error('Expected a config');
    expect(result.config.outDir).toBe('./tokens');
    expect(Object.keys(result.config.themes)).toEqual(['one', 'two']);
    expect(result.config.themes.one.colors).toMatchObject(theme.colors);
  });

  it('makes severity colors ordinary colors', () => {
    const result = importConfig(
      JSON.stringify({
        themes: {
          one: { ...theme, overrides: { severity: { danger: '#AA0000' } } },
        },
      }),
    );
    if (!('config' in result)) throw new Error('Expected a config');
    expect(result.config.themes.one.colors.danger).toBe('#AA0000');
    expect(Object.keys(result.config.themes.one.colors)).toEqual(
      expect.arrayContaining(['info', 'success', 'warning']),
    );
    expect(result.config.themes.one.overrides).toBeUndefined();
  });

  it('reads configs with the old color categories', () => {
    const result = importConfig(
      JSON.stringify({
        themes: {
          old: {
            colors: {
              main: { accent: '#0062BA' },
              support: { brand1: '#F45F63' },
              neutral: '#1E2B3C',
            },
          },
        },
      }),
    );
    if (!('config' in result)) throw new Error('Expected a config');
    expect(result.config.themes.old.colors).toMatchObject({
      accent: '#0062BA',
      brand1: '#F45F63',
      neutral: '#1E2B3C',
    });
  });

  it('reads comments and trailing commas, like the CLI does', () => {
    const result = importConfig(`{
      // my theme
      "themes": { "one": { "colors": { "neutral": "#1E2B3C", "accent": "#0062BA", }, }, },
    }`);
    expect('config' in result).toBe(true);
  });

  it('rejects names the CLI does not accept', () => {
    for (const name of ['Accent', '-', 'brand-', 'a--b']) {
      const result = validateConfig({
        themes: { one: { colors: { ...theme.colors, [name]: '#0062BA' } } },
      });
      expect(result).toMatchObject({ error: 'invalid' });
    }
  });

  it('tells empty text, missing themes and invalid configs apart', () => {
    expect(importConfig('  ')).toEqual({ error: 'empty' });
    expect(importConfig('{}')).toEqual({ error: 'no-themes' });
    expect(importConfig('{"themes":{}}')).toEqual({
      error: 'invalid',
      messages: ['themes: At least one theme must be defined.'],
    });
    expect(importConfig('{"themes":')).toMatchObject({ error: 'invalid' });
    expect(importConfig('{"themes":{"one":null}}')).toMatchObject({
      error: 'invalid',
    });
    expect(
      importConfig('{"themes":{"one":{"colors":{"accent":"blue"}}}}'),
    ).toEqual({
      error: 'invalid',
      messages: expect.arrayContaining([
        expect.stringContaining('themes.one.colors'),
      ]),
    });
  });
});
