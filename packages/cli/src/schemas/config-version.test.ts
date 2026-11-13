import { describe, expect, it } from 'vitest';
import {
  applyLegacyDefaults,
  configSchemaUrl,
  getConfigVersion,
  isLegacyConfig,
  toCurrentConfig,
  versionedSchema,
} from './config-version.ts';
import { severityColors } from './defaults.ts';
import { validateConfig } from './helpers.ts';
import { configSchema } from './schema.ts';

const v2Url = 'https://designsystemet.no/schemas/config/2.0.0.json';
const v2File = 'node_modules/@digdir/designsystemet/dist/config.v2.schema.json';

describe('getConfigVersion', () => {
  it.each([
    [v2Url, 2],
    ['https://designsystemet.no/schemas/config/2.3.1.json', 2],
    ['https://designsystemet.no/schemas/config/2.0.0-next.4.json', 2],
    ['https://designsystemet.no/schemas/config/1.24.0.json', 1],
    [v2File, 2],
    ['./node_modules/@digdir/designsystemet/dist/config.v2.schema.json', 2],
    ['..\\..\\packages\\cli\\dist\\config.v3.schema.json', 3],
  ])('reads the version from %s', (schema, version) => {
    expect(getConfigVersion(schema)).toBe(version);
  });

  it.each([
    ['node_modules/@digdir/designsystemet/dist/config.schema.json'],
    ['https://designsystemet.no/schemas/config/latest.json'],
    ['https://example.com/schemas/config/2.0.0.json'],
    [''],
    [undefined],
    [2],
  ])('has no version for %s', (schema) => {
    expect(getConfigVersion(schema)).toBeUndefined();
  });
});

describe('isLegacyConfig', () => {
  it('is true for a config without a versioned schema', () => {
    expect(isLegacyConfig({ themes: {} })).toBe(true);
    expect(isLegacyConfig({ $schema: 'node_modules/@digdir/designsystemet/dist/config.schema.json' })).toBe(true);
    expect(isLegacyConfig({ $schema: 'https://designsystemet.no/schemas/config/1.24.0.json' })).toBe(true);
  });

  it('is false for a config with a versioned schema', () => {
    expect(isLegacyConfig({ $schema: v2Url })).toBe(false);
    expect(isLegacyConfig({ $schema: v2File })).toBe(false);
  });
});

describe('configSchemaUrl', () => {
  it('uses the CLI version from version 2', () => {
    expect(configSchemaUrl('2.1.0')).toBe('https://designsystemet.no/schemas/config/2.1.0.json');
  });

  it('uses the first versioned schema for earlier versions, so the config is not read as an older one', () => {
    expect(configSchemaUrl('1.24.0')).toBe(v2Url);
    expect(getConfigVersion(configSchemaUrl('1.24.0'))).toBe(2);
  });
});

describe('versionedSchema', () => {
  it('points a config without $schema to the file in the package', () => {
    expect(versionedSchema(undefined, '2.0.0')).toBe(v2File);
  });

  it('keeps the directory of a local schema', () => {
    expect(versionedSchema('./node_modules/@digdir/designsystemet/dist/config.schema.json', '2.0.0')).toBe(
      './node_modules/@digdir/designsystemet/dist/config.v2.schema.json',
    );
    expect(versionedSchema('packages/cli/dist/config.schema.json', '2.0.0')).toBe(
      'packages/cli/dist/config.v2.schema.json',
    );
  });

  it('points a URL to the published schema of this version', () => {
    expect(versionedSchema('https://designsystemet.no/schemas/config/1.24.0.json', '2.1.0')).toBe(
      'https://designsystemet.no/schemas/config/2.1.0.json',
    );
  });

  it.each([
    [undefined],
    ['node_modules/@digdir/designsystemet/dist/config.schema.json'],
    ['https://designsystemet.no/schemas/config/1.24.0.json'],
    ['./my-copy-of-the-schema.json'],
  ])('always gives a schema the CLI reads as migrated, from %s', (schema) => {
    expect(isLegacyConfig({ $schema: versionedSchema(schema, '1.24.0') })).toBe(false);
  });
});

describe('applyLegacyDefaults', () => {
  const theme = { colors: { accent: '#0062BA' } };

  it('adds the default severity colors to the themes of an older config', () => {
    const config = { themes: { one: theme } };
    expect(applyLegacyDefaults(config).themes.one.colors).toEqual({ accent: '#0062BA', ...severityColors });
    // The argument is not changed
    expect(config.themes.one.colors).toEqual({ accent: '#0062BA' });
  });

  it('keeps severity colors already in colors, and uses overrides.severity before the defaults', () => {
    const config = {
      themes: {
        one: { colors: { accent: '#0062BA', info: '#111111' }, overrides: { severity: { danger: '#AA0000' } } },
      },
    };
    expect(applyLegacyDefaults(config).themes.one.colors).toMatchObject({ info: '#111111', danger: '#AA0000' });
  });

  it('leaves a config with a versioned schema as it is', () => {
    const config = { $schema: v2Url, themes: { one: theme } };
    expect(applyLegacyDefaults(config)).toBe(config);
  });
});

describe('toCurrentConfig', () => {
  it('moves the severity colors of an older config into colors and sets a versioned $schema', () => {
    const config = {
      $schema: 'https://designsystemet.no/schemas/config/1.24.0.json',
      themes: {
        one: { colors: { accent: '#0062BA' }, overrides: { severity: { danger: '#AA0000' } } },
        two: {
          colors: { accent: '#111111' },
          overrides: { severity: { danger: '#BB0000' }, focus: { inner: { light: '#ffffff' } } },
        },
      },
    };

    expect(toCurrentConfig(config, '2.1.0')).toEqual({
      $schema: 'https://designsystemet.no/schemas/config/2.1.0.json',
      themes: {
        one: { colors: { accent: '#0062BA', ...severityColors, danger: '#AA0000' } },
        two: {
          colors: { accent: '#111111', ...severityColors, danger: '#BB0000' },
          overrides: { focus: { inner: { light: '#ffffff' } } },
        },
      },
    });
  });

  it('leaves a current config as it is, without adding severity colors', () => {
    const config = { $schema: v2Url, themes: { one: { colors: { accent: '#0062BA' } } } };
    expect(toCurrentConfig(config, '2.1.0')).toBe(config);
  });

  it('gives a config that is not migrated again', () => {
    const current = toCurrentConfig({ themes: { one: { colors: { accent: '#0062BA' } } } }, '1.24.0');
    expect(isLegacyConfig(current)).toBe(false);
  });
});

describe('severity colors in a validated config', () => {
  const colors = { accent: '#0062BA', danger: '#C01B1B' };

  it('are only the ones in colors when the config has a versioned schema', () => {
    const config = validateConfig(configSchema, { $schema: v2Url, themes: { one: { colors } } });
    expect(Object.keys(config.themes?.one.colors ?? {})).toEqual(['accent', 'danger']);
    // `$schema` survives validation, so validating the result again does not add the defaults
    expect(config.$schema).toBe(v2Url);
  });

  it('are all four for an older config', () => {
    const config = validateConfig(configSchema, { themes: { one: { colors } } });
    expect(Object.keys(config.themes?.one.colors ?? {})).toEqual(['accent', 'info', 'success', 'warning', 'danger']);
  });
});
