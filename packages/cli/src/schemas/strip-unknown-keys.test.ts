import { describe, expect, it } from 'vitest';
import { externalConfigSchema } from './schema.ts';
import { stripUnknownConfigKeys } from './strip-unknown-keys.ts';

const config = {
  output: ['css', { type: 'css', dir: 'out', tailwind: 'v4' }, { type: 'types', tokensDir: 'tokens' }],
  outDir: './tokens',
  clean: true,
  themes: {
    one: {
      colors: { neutral: '#1E2B3C', accent: '#0062BA', 'my-brand': '#F45F63' },
      typography: { fontFamily: 'Inter' },
      borderRadius: 8,
      overrides: {
        colors: { accent: { 'background-default': { light: '#FFFFFF', dark: '#000000' } } },
        severity: { danger: '#AA0000' },
        linkVisited: { light: '#663399' },
        focus: { inner: { light: '#FFFFFF' }, outer: { dark: '#000000' } },
      },
    },
  },
};

describe('stripUnknownConfigKeys', () => {
  it('leaves a config with only known keys as it was written', () => {
    expect(externalConfigSchema.safeParse(config).success).toBe(true);
    const stripped = stripUnknownConfigKeys(config);
    expect(stripped).toEqual(config);
    expect(Object.keys(stripped.themes.one.colors)).toEqual(['neutral', 'accent', 'my-brand']);
  });

  it('removes unknown keys at every level', () => {
    const [shorthand, css, types] = config.output;
    const { one } = config.themes;
    const withUnknown = {
      $schema: 'https://example.com/schema.json',
      junk: { text: 'a'.repeat(1000) },
      ...config,
      output: [shorthand, { ...(css as object), junk: 1 }, { ...(types as object), tailwind: 'v4', junk: 1 }],
      themes: {
        one: {
          ...one,
          overrides: {
            ...one.overrides,
            junk: 1,
            colors: { accent: { 'background-default': { light: '#FFFFFF', dark: '#000000', junk: 1 } } },
            linkVisited: { ...one.overrides.linkVisited, junk: 1 },
            focus: { inner: { light: '#FFFFFF', junk: 1 }, outer: { dark: '#000000' }, junk: 1 },
          },
        },
      },
    };
    expect(externalConfigSchema.safeParse(withUnknown).success).toBe(true);

    const stripped = stripUnknownConfigKeys(withUnknown);
    expect(JSON.stringify(stripped)).not.toContain('junk');
    expect(stripped).not.toHaveProperty('$schema');
    // A key that any kind of output has is kept for every kind of output
    expect(stripped.output[2]).toEqual({ ...(types as object), tailwind: 'v4' });
    expect({ ...stripped, output: config.output }).toEqual(config);
  });

  it('keeps keys named like properties of objects', () => {
    const colors = { neutral: '#1E2B3C', constructor: '#0062BA', tostring: '#F45F63' };
    const stripped = stripUnknownConfigKeys({ constructor: 1, themes: { one: { colors } } });
    expect(stripped).toEqual({ themes: { one: { colors } } });
  });
});
