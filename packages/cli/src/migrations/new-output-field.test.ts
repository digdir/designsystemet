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
        { type: 'design-tokens', dir: 'tokens', cleanDir: true },
        { type: 'css', dir: 'design-tokens-build', tokensDir: 'tokens' },
        { type: 'types', dir: 'design-tokens-build', tokensDir: 'tokens' },
      ],
    });
  });

  // A comment between a value and its comma used to hide the comma, leaving invalid JSON behind.
  it.each([
    ['a block comment before the comma', '{ "outDir": "design-tokens" /* note */, "themes": {} }'],
    ['a line comment after the comma', '{\n  "clean": false, // note\n  "themes": {}\n}'],
    ['a line comment before the comma', '{\n  "clean": false // note\n  ,"themes": {}\n}'],
    ['a comment after the last property', '{ "themes": {}, "clean": false /* last */ }'],
  ])('removes the deprecated fields and keeps the config valid with %s', (_, config) => {
    const migrated = migrateToOutputField(config);

    expect(parseJsonc(migrated)).toEqual({
      output: [
        { type: 'design-tokens', dir: 'design-tokens' },
        { type: 'css', dir: 'design-tokens-build' },
        { type: 'types', dir: 'design-tokens-build' },
      ],
      themes: {},
    });
    expect(migrated).toMatch(/note|last/);
  });

  it('places output after $schema if present, otherwise at the top', () => {
    const withSchema = migrateToOutputField('{ "themes": {}, "$schema": "schema.json", "outDir": "tokens" }');
    expect(Object.keys(parseJsonc(withSchema))).toEqual(['themes', '$schema', 'output']);

    const withoutSchema = migrateToOutputField('{ "themes": {}, "outDir": "tokens" }');
    expect(Object.keys(parseJsonc(withoutSchema))).toEqual(['output', 'themes']);
  });

  // The deprecated fields created design tokens, and the default `output` doesn't, so it's always defined.
  it('defines output with design tokens when the deprecated fields have default values', () => {
    const expected = {
      output: [
        { type: 'design-tokens', dir: 'design-tokens' },
        { type: 'css', dir: 'design-tokens-build' },
        { type: 'types', dir: 'design-tokens-build' },
      ],
    };

    expect(parseJsonc(migrateToOutputField('{ "outDir": "./design-tokens" }'))).toEqual(expected);
    expect(parseJsonc(migrateToOutputField('{ "outDir": "./design-tokens", "clean": false }'))).toEqual(expected);
    expect(parseJsonc(migrateToOutputField('{ "clean": false }'))).toEqual(expected);
  });

  // `clean` only cleaned the design tokens, and `tokens build` didn't clean CSS and types by default.
  it('carries clean: true over as cleanDir: true on the design-tokens output', () => {
    expect(parseJsonc(migrateToOutputField('{ "outDir": "tokens", "clean": true }'))).toEqual({
      output: [
        { type: 'design-tokens', dir: 'tokens', cleanDir: true },
        { type: 'css', dir: 'design-tokens-build', tokensDir: 'tokens' },
        { type: 'types', dir: 'design-tokens-build', tokensDir: 'tokens' },
      ],
    });
    expect(parseJsonc(migrateToOutputField('{ "clean": true }'))).toEqual({
      output: [
        { type: 'design-tokens', dir: 'design-tokens', cleanDir: true },
        { type: 'css', dir: 'design-tokens-build' },
        { type: 'types', dir: 'design-tokens-build' },
      ],
    });
  });

  // Outputs that share a directory must clean it the same way, or the CLI stops with an error.
  it('cleans CSS and types too when the design tokens are in the same directory', () => {
    expect(parseJsonc(migrateToOutputField('{ "outDir": "./design-tokens-build", "clean": true }'))).toEqual({
      output: [
        { type: 'design-tokens', dir: './design-tokens-build', cleanDir: true },
        { type: 'css', dir: 'design-tokens-build', tokensDir: './design-tokens-build', cleanDir: true },
        { type: 'types', dir: 'design-tokens-build', tokensDir: './design-tokens-build', cleanDir: true },
      ],
    });
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
        { type: 'css', dir: 'design-tokens-build', tokensDir: 'tokens' },
        { type: 'types', dir: 'design-tokens-build', tokensDir: 'tokens' },
      ],
    });
    expect(parseJsonc(migration.yes('{ /* default */ "outDir": "design-tokens", "themes": {} }'))).toEqual({
      output: [
        { type: 'design-tokens', dir: 'design-tokens' },
        { type: 'css', dir: 'design-tokens-build' },
        { type: 'types', dir: 'design-tokens-build' },
      ],
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
          { type: 'css', dir: '../design-tokens-build', tokensDir: '../tokens' },
          { type: 'types', dir: '../design-tokens-build', tokensDir: '../tokens' },
        ],
      });
    });

    it('keeps the default outDir pointing to the same directory', () => {
      expect(parseJsonc(migrateToOutputField('{ "clean": true }', context))).toEqual({
        output: [
          { type: 'design-tokens', dir: '../design-tokens', cleanDir: true },
          { type: 'css', dir: '../design-tokens-build', tokensDir: '../design-tokens' },
          { type: 'types', dir: '../design-tokens-build', tokensDir: '../design-tokens' },
        ],
      });
    });

    it('rewrites an absolute outDir relative to the config file', () => {
      expect(parseJsonc(migrateToOutputField('{ "outDir": "/project/configs/tokens" }', context))).toEqual({
        output: [
          { type: 'design-tokens', dir: 'tokens' },
          { type: 'css', dir: '../design-tokens-build', tokensDir: 'tokens' },
          { type: 'types', dir: '../design-tokens-build', tokensDir: 'tokens' },
        ],
      });
    });

    it('defines output without directories when outDir resolves to the default directory next to the config file', () => {
      expect(parseJsonc(migrateToOutputField('{ "outDir": "configs/design-tokens" }', context))).toEqual({
        output: [
          { type: 'design-tokens', dir: 'design-tokens' },
          { type: 'css', dir: '../design-tokens-build' },
          { type: 'types', dir: '../design-tokens-build' },
        ],
      });
    });
  });

  it('leaves the config unchanged when declined', () => {
    const config = '{ "outDir": "tokens" }';

    expect(migration.no(config)).toBe(config);
  });
});
