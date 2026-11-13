import { describe, expect, it } from 'vitest';
import { isLegacyConfig } from '../schemas/config-version.ts';
import { parseJsonc } from '../schemas/helpers.ts';
import migration, { migrateToOptionalSeverityColors } from './optional-severity-colors.ts';

const migrate = (config: string) => migrateToOptionalSeverityColors(config, '2.0.0');

describe('optional severity colors migration', () => {
  it('is offered for a config without a versioned schema', () => {
    expect(migration.check('{ "themes": { "one": { "colors": { "accent": "#0062BA" } } } }')).toBe(true);
    expect(
      migration.check(
        '{ "$schema": "node_modules/@digdir/designsystemet/dist/config.schema.json", "themes": { "one": { "colors": { "accent": "#0062BA" } } } }',
      ),
    ).toBe(true);
  });

  it('is not offered for a migrated config, or a config without themes', () => {
    expect(migration.check(migrate('{ "themes": { "one": { "colors": { "accent": "#0062BA" } } } }'))).toBe(false);
    expect(migration.check('{ "output": [] }')).toBe(false);
  });

  it('adds the default severity colors to every theme and sets a versioned $schema', () => {
    const migrated = parseJsonc<Record<string, unknown>>(
      migrate(`{
  "themes": {
    "one": { "colors": { "accent": "#0062BA" } },
    "two": { "colors": { "accent": "#111111" } }
  }
}`),
    );

    const severity = { info: '#0A71C0', success: '#068718', warning: '#EA9B1B', danger: '#C01B1B' };
    expect(migrated).toEqual({
      $schema: 'node_modules/@digdir/designsystemet/dist/config.v2.schema.json',
      themes: {
        one: { colors: { accent: '#0062BA', ...severity } },
        two: { colors: { accent: '#111111', ...severity } },
      },
    });
    expect(Object.keys(migrated)[0]).toBe('$schema');
  });

  it('keeps severity colors that are in colors already', () => {
    const migrated = parseJsonc<{ themes: { one: { colors: Record<string, string> } } }>(
      migrate('{ "themes": { "one": { "colors": { "accent": "#0062BA", "danger": "#AA0000" } } } }'),
    );
    expect(migrated.themes.one.colors.danger).toBe('#AA0000');
  });

  it('moves overrides.severity into colors', () => {
    const migrated = parseJsonc<{ themes: { one: { colors: Record<string, string>; overrides?: unknown } } }>(
      migrate(`{
  "themes": {
    "one": {
      "colors": { "accent": "#0062BA" },
      "overrides": { "severity": { "danger": "#AA0000" } }
    }
  }
}`),
    );
    expect(migrated.themes.one.colors.danger).toBe('#AA0000');
    expect(migrated.themes.one.colors.info).toBe('#0A71C0');
    expect(migrated.themes.one.overrides).toBeUndefined();
  });

  it('keeps other overrides when moving overrides.severity', () => {
    const migrated = parseJsonc<{ themes: { one: { overrides?: unknown } } }>(
      migrate(`{
  "themes": {
    "one": {
      "colors": { "accent": "#0062BA" },
      "overrides": {
        "severity": { "danger": "#AA0000" },
        "focus": { "inner": { "light": "#ffffff" } }
      }
    }
  }
}`),
    );
    expect(migrated.themes.one.overrides).toEqual({ focus: { inner: { light: '#ffffff' } } });
  });

  it('replaces the schema file name next to a local schema, and uses the published schema for a URL', () => {
    const local = parseJsonc<{ $schema: string }>(
      migrate(
        '{ "$schema": "./node_modules/@digdir/designsystemet/dist/config.schema.json", "themes": { "one": { "colors": { "accent": "#0062BA" } } } }',
      ),
    );
    expect(local.$schema).toBe('./node_modules/@digdir/designsystemet/dist/config.v2.schema.json');

    const url = parseJsonc<{ $schema: string }>(
      migrate(
        '{ "$schema": "https://designsystemet.no/schemas/config/1.24.0.json", "themes": { "one": { "colors": { "accent": "#0062BA" } } } }',
      ),
    );
    expect(url.$schema).toBe('https://designsystemet.no/schemas/config/2.0.0.json');
  });

  it('keeps comments', () => {
    const migrated = migrate(`{
  // The themes
  "themes": {
    "one": {
      "colors": {
        "accent": "#0062BA" // The accent color
      }
    }
  }
}`);
    expect(migrated).toContain('// The themes');
    expect(migrated).toContain('// The accent color');
    expect(isLegacyConfig(parseJsonc(migrated))).toBe(false);
  });

  it('uses the config as it is when declined', () => {
    const config = '{ "themes": { "one": { "colors": { "accent": "#0062BA" } } } }';
    expect(migration.no(config)).toBe(config);
  });
});
