import { describe, expect, it } from 'vitest';
import { stringifyConfig } from './stringify-config.ts';

describe('stringifyConfig', () => {
  it('puts light/dark objects on one line and keeps the rest like JSON.stringify', () => {
    const config = {
      themes: {
        t: {
          colors: {
            accent: {
              'background-default': { light: '#ffffff', dark: '#0c1927' },
              'base-default': { light: '#0062ba' },
            },
            neutral: '#24272b',
          },
          overrides: { focus: { inner: { dark: '#000000' } } },
        },
      },
    };

    expect(stringifyConfig(config)).toBe(`{
  "themes": {
    "t": {
      "colors": {
        "accent": {
          "background-default": { "light": "#ffffff", "dark": "#0c1927" },
          "base-default": { "light": "#0062ba" }
        },
        "neutral": "#24272b"
      },
      "overrides": {
        "focus": {
          "inner": { "dark": "#000000" }
        }
      }
    }
  }
}`);
    expect(JSON.parse(stringifyConfig(config))).toEqual(config);
  });

  it('leaves objects with other keys expanded', () => {
    const config = { a: { light: '#fff', other: 'x' } };
    expect(stringifyConfig(config)).toBe(JSON.stringify(config, null, 2));
  });
});
