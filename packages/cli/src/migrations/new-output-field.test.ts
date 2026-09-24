import { describe, expect, it } from 'vitest';
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
        { type: 'css', tokenDir: 'tokens' },
      ],
    });
  });

  it('does not define output when the deprecated fields have default values', () => {
    expect(parseJsonc(migrateToOutputField('{ "outDir": "./design-tokens", "clean": false }'))).toEqual({});
    expect(parseJsonc(migrateToOutputField('{ "clean": true }'))).toEqual({});
  });

  it('only removes deprecated fields when output is already set', () => {
    const migrated = migrateToOutputField('{ "outDir": "tokens", "output": ["css"] }');

    expect(parseJsonc(migrated)).toEqual({ output: ['css'] });
  });

  it('leaves the config unchanged when declined', () => {
    const config = '{ "outDir": "tokens" }';

    expect(migration.no(config)).toBe(config);
  });
});
