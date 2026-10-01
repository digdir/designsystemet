import { describe, expect, it, vi } from 'vitest';
import { parseJsonc } from '../schemas/helpers.ts';
import migration, { migrateToOutputField } from './new-output-field.ts';

describe('new output field migration', () => {
  it('only applies to configs with deprecated fields', () => {
    expect(migration.check('{ "outDir": "tokens" }')).toBe(true);
    expect(migration.check('{ "clean": false }')).toBe(true);
    expect(migration.check('{ "output": ["css"] }')).toBe(false);
  });

  it('replaces outDir and clean with output, preserving comments', () => {
    const config = `{
  "outDir": "tokens",
  "clean": true,
  // my themes
  "themes": {}
}`;
    const migrated = migrateToOutputField(config);

    expect(migrated).toContain('// my themes');
    expect(parseJsonc(migrated)).toEqual({
      themes: {},
      output: [
        { type: 'design-tokens', dir: 'tokens' },
        { type: 'css', tokensDir: 'tokens' },
      ],
    });
  });

  it('places output after $schema if present, otherwise at the top', () => {
    const withSchema = migrateToOutputField('{ "themes": {}, "$schema": "schema.json", "outDir": "tokens" }');
    expect(Object.keys(parseJsonc(withSchema))).toEqual(['themes', '$schema', 'output']);

    const withoutSchema = migrateToOutputField('{ "themes": {}, "outDir": "tokens" }');
    expect(Object.keys(parseJsonc(withoutSchema))).toEqual(['output', 'themes']);
  });

  it('does not define output when the deprecated fields have default values', () => {
    expect(parseJsonc(migrateToOutputField('{ "outDir": "./design-tokens", "clean": false }'))).toEqual({});
    expect(parseJsonc(migrateToOutputField('{ "clean": true }'))).toEqual({});
  });

  it('only removes deprecated fields when output is already set', () => {
    const migrated = migrateToOutputField('{ "outDir": "tokens", "output": ["css"] }');

    expect(parseJsonc(migrated)).toEqual({ output: ['css'] });
  });

  it('migrates JSONC configs with comments and trailing commas', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const config = `{
  // my output
  "outDir": "tokens",
  "themes": {},
}`;

    expect(parseJsonc(migration.yes(config))).toEqual({
      themes: {},
      output: [
        { type: 'design-tokens', dir: 'tokens' },
        { type: 'css', tokensDir: 'tokens' },
      ],
    });
    expect(parseJsonc(migration.yes('{ /* default */ "outDir": "design-tokens", "themes": {} }'))).toEqual({
      themes: {},
    });
    vi.restoreAllMocks();
  });

  describe('when the config file is not in the directory the CLI was run from', () => {
    const context = { configFilePath: 'configs/designsystemet.config.json', cwd: '/project' };

    it('rewrites outDir relative to the config file', () => {
      expect(parseJsonc(migrateToOutputField('{ "outDir": "tokens" }', context))).toEqual({
        output: [
          { type: 'design-tokens', dir: '../tokens' },
          { type: 'css', tokensDir: '../tokens' },
        ],
      });
    });

    it('keeps the default outDir pointing to the same directory', () => {
      expect(parseJsonc(migrateToOutputField('{ "clean": true }', context))).toEqual({
        output: [
          { type: 'design-tokens', dir: '../design-tokens' },
          { type: 'css', tokensDir: '../design-tokens' },
        ],
      });
    });

    it('rewrites an absolute outDir relative to the config file', () => {
      expect(parseJsonc(migrateToOutputField('{ "outDir": "/project/configs/tokens" }', context))).toEqual({
        output: [
          { type: 'design-tokens', dir: 'tokens' },
          { type: 'css', tokensDir: 'tokens' },
        ],
      });
    });

    it('does not define output when outDir resolves to the default directory next to the config file', () => {
      expect(parseJsonc(migrateToOutputField('{ "outDir": "configs/design-tokens" }', context))).toEqual({});
    });
  });

  it('leaves the config unchanged when declined', () => {
    const config = '{ "outDir": "tokens" }';

    expect(migration.no(config)).toBe(config);
  });
});
