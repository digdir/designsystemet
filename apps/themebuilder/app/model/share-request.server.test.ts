import { describe, expect, it } from 'vitest';
import { isFromThemeBuilder, readSharedConfig } from './share-request.server';
import {
  MAX_SHARED_COLORS,
  MAX_SHARED_THEME_BYTES,
  MAX_SHARED_THEMES,
} from './shared-themes';

const theme = { colors: { neutral: '#1E2B3C', accent: '#0062BA' } };

const request = (body: string, headers: Record<string, string> = {}) =>
  new Request('http://localhost/api/themes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body,
  });

const read = (config: unknown) =>
  readSharedConfig(request(JSON.stringify({ config })));

describe('readSharedConfig', () => {
  it('reads a config as it was written', async () => {
    const config = {
      outDir: './tokens',
      themes: {
        one: {
          colors: { zebra: '#F45F63', ...theme.colors },
          overrides: {
            colors: { accent: { 'background-default': { light: '#FFFFFF' } } },
          },
        },
      },
    };
    const result = await read(config);
    if (!('config' in result)) throw new Error('Expected a config');
    expect(result.config).toMatchObject(config);
    expect(Object.keys(result.config.themes.one.colors).slice(0, 3)).toEqual([
      'zebra',
      'neutral',
      'accent',
    ]);
  });

  it('removes the keys the CLI does not know', async () => {
    const result = await read({
      $schema: 'https://example.com/schema.json',
      junk: 'a'.repeat(1000),
      themes: {
        one: { ...theme, overrides: { junk: 'a', focus: { junk: 'a' } } },
      },
    });
    if (!('config' in result)) throw new Error('Expected a config');
    expect(JSON.stringify(result.config)).not.toContain('junk');
    expect(result.config).not.toHaveProperty('$schema');
    expect(result.config.themes.one.colors).toMatchObject(theme.colors);
  });

  it('turns down what is not a config', async () => {
    const invalid = { error: 'invalid', status: 400 };
    expect(await readSharedConfig(request('{"config":'))).toEqual(invalid);
    expect(await readSharedConfig(request('null'))).toEqual(invalid);
    expect(await read(undefined)).toEqual(invalid);
    expect(await read({})).toEqual(invalid);
    expect(
      await read({ themes: { one: { colors: { accent: 'blue' } } } }),
    ).toEqual(invalid);
    // A theme cannot have keys the CLI does not know, unlike the rest of the config
    expect(await read({ themes: { one: { ...theme, junk: 1 } } })).toEqual(
      invalid,
    );
  });

  it('turns down a body that is too large, whatever its length header says', async () => {
    const tooLarge = { error: 'too-large', status: 413 };
    const body = JSON.stringify({
      config: {
        themes: { one: theme },
        junk: 'a'.repeat(MAX_SHARED_THEME_BYTES),
      },
    });
    expect(await readSharedConfig(request(body))).toEqual(tooLarge);
    expect(
      await readSharedConfig(
        request('{}', { 'Content-Length': String(MAX_SHARED_THEME_BYTES + 1) }),
      ),
    ).toEqual(tooLarge);
  });

  it('turns down a config with too many themes or colors', async () => {
    const tooLarge = { error: 'too-large', status: 413 };
    const names = (count: number) =>
      Array.from({ length: count }, (_, index) => `name-${index}`);
    const themes = (count: number) =>
      Object.fromEntries(names(count).map((name) => [name, theme]));
    const colors = (count: number) =>
      Object.fromEntries(
        ['neutral', ...names(count - 1)].map((name) => [name, '#0062BA']),
      );

    expect(
      'config' in (await read({ themes: themes(MAX_SHARED_THEMES) })),
    ).toBe(true);
    expect(await read({ themes: themes(MAX_SHARED_THEMES + 1) })).toEqual(
      tooLarge,
    );
    expect(
      'config' in (await read({ themes: { one: { colors: colors(30) } } })),
    ).toBe(true);
    expect(
      await read({
        themes: { one: { colors: colors(MAX_SHARED_COLORS + 1) } },
      }),
    ).toEqual(tooLarge);
  });
});

describe('isFromThemeBuilder', () => {
  it('takes JSON from the same origin, and from clients that do not say where they are', () => {
    expect(isFromThemeBuilder(request('{}'))).toBe(true);
    expect(
      isFromThemeBuilder(request('{}', { 'Sec-Fetch-Site': 'same-origin' })),
    ).toBe(true);
  });

  it('turns down other sites, and bodies a form on another site can send', () => {
    for (const site of ['cross-site', 'same-site', 'none'])
      expect(
        isFromThemeBuilder(request('{}', { 'Sec-Fetch-Site': site })),
      ).toBe(false);
    expect(
      isFromThemeBuilder(request('{}', { 'Content-Type': 'text/plain' })),
    ).toBe(false);
  });
});
