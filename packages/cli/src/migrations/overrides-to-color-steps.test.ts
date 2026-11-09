// biome-ignore-all lint/suspicious/noExplicitAny: the migrated configs are read without a schema
import { describe, expect, it, vi } from 'vitest';
import { semanticColorNames } from '../colors/specs.ts';
import { parseJsonc } from '../schemas/helpers.ts';
import { configSchema } from '../schemas/schema.ts';
import { generateColorScheme } from '../tokens/create/generators/primitives/color-scheme.ts';
import migration, { migrateOverridesToColorSteps } from './overrides-to-color-steps.ts';

/** The colors each theme of a config builds, in light and dark. */
function builtColors(config: string) {
  const { themes } = configSchema.parse(parseJsonc(config));
  return Object.fromEntries(
    Object.entries(themes ?? {}).map(([name, theme]) => [
      name,
      {
        light: generateColorScheme(name, 'light', theme.colors, theme.overrides),
        dark: generateColorScheme(name, 'dark', theme.colors, theme.overrides),
      },
    ]),
  );
}

const config = `{
  // My themes
  "themes": {
    "first": {
      "colors": {
        "accent": "#0062BA", // brand blue
        "neutral": "#24272B",
        "warning": "#EA9B1B"
      },
      "overrides": {
        "colors": {
          "accent": { "background-tinted": { "light": "#ff0000" } },
          "neutral": { "text-default": { "light": "#111111", "dark": "#eeeeee" } },
          "danger": { "border-default": { "dark": "#aa0000" } },
          "warning": { "base-default": { "light": "#ffaa00" } }
        },
        "severity": { "info": "#0055aa" },
        "focus": { "inner": { "light": "#ff00ff" } }
      }
    },
    "second": {
      "colors": { "accent": "#0D7A5F", "neutral": "#1E2B3C", "warning": "#EA9B1B" }
    }
  }
}`;

describe('overrides to color steps migration', () => {
  it('only applies to configs with overrides.colors or overrides.severity', () => {
    expect(migration.check(config)).toBe(true);
    expect(migration.check('{ "themes": { "t": { "overrides": { "severity": {} } } } }')).toBe(true);
    expect(migration.check('{ "themes": { "t": { "overrides": { "focus": {} } } } }')).toBe(false);
    expect(migration.check('{ "output": [] }')).toBe(false);
  });

  it('gives a config that builds the same colors, without the deprecated overrides', () => {
    const migrated = migrateOverridesToColorSteps(config);

    expect(builtColors(migrated)).toEqual(builtColors(config));
    expect(migration.check(migrated)).toBe(false);
    expect(parseJsonc<any>(migrated).themes.first.overrides).toEqual({ focus: { inner: { light: '#ff00ff' } } });
  });

  it('sets only the overridden steps on each color, with the base color', () => {
    const { first, second } = parseJsonc<any>(migrateOverridesToColorSteps(config)).themes;

    expect(first.colors.accent).toEqual({
      'background-tinted': { light: '#ff0000' },
      'base-default': { light: '#0062BA' },
    });
    expect(first.colors.neutral).toEqual({
      'text-default': { light: '#111111', dark: '#eeeeee' },
      'base-default': { light: '#24272B' },
    });
    // A default severity color, and one from overrides.severity.
    expect(first.colors.danger).toEqual({
      'border-default': { dark: '#aa0000' },
      'base-default': { light: '#C01B1B' },
    });
    expect(first.colors.info).toBe('#0055aa');
    expect(second).toEqual({ colors: { accent: '#0D7A5F', neutral: '#1E2B3C', warning: '#EA9B1B' } });
  });

  it('writes every step of a color whose base-default in light is overridden', () => {
    const { warning } = parseJsonc<any>(migrateOverridesToColorSteps(config)).themes.first.colors;

    // base-default in light is the base color, so overriding only that step needs the rest of the scale written out.
    expect(Object.keys(warning)).toEqual(semanticColorNames);
    expect(warning['base-default'].light).toBe('#ffaa00');
  });

  it('keeps comments, and writes each step on one line', () => {
    const migrated = migrateOverridesToColorSteps(config);

    expect(migrated).toContain('// My themes');
    expect(migrated).toContain('// brand blue');
    expect(migrated).toContain(`        "accent": {
          "background-tinted": { "light": "#ff0000" },
          "base-default": { "light": "#0062BA" }
        },`);
  });

  it('removes overrides of colors the theme does not have, which had no effect', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const migrated = migrateOverridesToColorSteps(`{
  "themes": {
    "t": {
      "colors": { "accent": "#0062ba", "neutral": "#24272b" },
      "overrides": { "colors": { "missing": { "text-default": { "light": "#111111" } } } }
    }
  }
}`);

    expect(parseJsonc<any>(migrated).themes.t).toEqual({ colors: { accent: '#0062ba', neutral: '#24272b' } });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('"overrides.colors.missing" is removed'));
    log.mockRestore();
  });

  it('sets overrides on colors already written as color steps', () => {
    const migrated = migrateOverridesToColorSteps(`{
  "themes": {
    "t": {
      "colors": {
        "accent": { "base-default": { "light": "#0062ba" }, "text-default": { "light": "#000001" } },
        "neutral": "#24272b"
      },
      "overrides": { "colors": { "accent": { "text-default": { "dark": "#eeeeee" } } } }
    }
  }
}`);

    expect(parseJsonc<any>(migrated).themes.t.colors.accent).toEqual({
      'text-default': { light: '#000001', dark: '#eeeeee' },
      'base-default': { light: '#0062ba' },
    });
  });
});
