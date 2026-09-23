import { describe, expect, it } from 'vitest';
import { configSchema } from '../schemas/schema.ts';
import { generate$Themes } from '../tokens/create/generators/$themes.ts';
import { createTokens, getTokenSetDimensions } from '../tokens/create.ts';
import type { Theme, TokenSet } from '../tokens/types.ts';
import { toColorNames } from '../tokens/utils.ts';
import { FIGMA_COLLECTION, toFigmaCollections } from './collections.ts';
import { figmaVariableScopes, figmaVariableType, isPrivateTokenPath } from './scopes.ts';

const { THEME, COLOR_SCHEME, SEMANTIC, COLOR, SIZE, TYPOGRAPHY } = FIGMA_COLLECTION;

describe('figmaVariableScopes', () => {
  it('scopes colors for use in Semantic and Color, not in the raw scales', () => {
    const color = { path: ['background-default'], type: 'color' };
    expect(figmaVariableScopes(COLOR, color)).toEqual(['ALL_SCOPES']);
    expect(figmaVariableScopes(SEMANTIC, { path: ['color', 'accent', 'base-default'], type: 'color' })).toEqual([
      'ALL_SCOPES',
    ]);
    expect(figmaVariableScopes(THEME, { path: ['color', 'accent', '1'], type: 'color' })).toEqual([]);
    expect(figmaVariableScopes(COLOR_SCHEME, { path: ['test', 'accent', '1'], type: 'color' })).toEqual([]);
  });

  it('keys float scopes on the token type and group, not the name', () => {
    expect(figmaVariableScopes(SEMANTIC, { path: ['border-radius', 'sm'], type: 'dimension' })).toEqual([
      'CORNER_RADIUS',
    ]);
    expect(figmaVariableScopes(SEMANTIC, { path: ['radius-renamed', 'sm'], type: 'dimension' })).toBeNull();
    expect(figmaVariableScopes(SEMANTIC, { path: ['border-width', 'default'], type: 'borderWidth' })).toEqual([
      'STROKE_FLOAT',
    ]);
    expect(figmaVariableScopes(SEMANTIC, { path: ['opacity', 'disabled'], type: 'opacity' })).toEqual(['OPACITY']);
    expect(figmaVariableScopes(SEMANTIC, { path: ['size', '4'], type: 'dimension' })).toEqual(['GAP', 'WIDTH_HEIGHT']);
    expect(figmaVariableScopes(SIZE, { path: ['font-size', '3'], type: 'fontSizes' })).toEqual(['FONT_SIZE']);
    expect(figmaVariableScopes(THEME, { path: ['border-radius', 'base'], type: 'dimension' })).toEqual([]);
  });

  it('scopes theme fonts and leaves the per-set typography values unscoped', () => {
    expect(figmaVariableScopes(THEME, { path: ['font-weight', 'medium'], type: 'fontWeights' })).toEqual([
      'FONT_STYLE',
    ]);
    expect(figmaVariableScopes(THEME, { path: ['font-family'], type: 'fontFamilies' })).toEqual(['FONT_FAMILY']);
    expect(figmaVariableScopes(TYPOGRAPHY, { path: ['test', 'font-family'], type: 'fontFamilies' })).toEqual([]);
  });

  it('treats private tokens as intentionally unscoped', () => {
    expect(isPrivateTokenPath(['_size', 'base'])).toBe(true);
    expect(isPrivateTokenPath(['size', '_step'])).toBe(true);
    expect(isPrivateTokenPath(['size', '4'])).toBe(false);
    expect(figmaVariableScopes(SIZE, { path: ['_size', 'base'], type: 'number' })).toEqual([]);
  });
});

/**
 * Every generated token that becomes a Figma variable must match a scope rule. Runs the same
 * grouping the plugin does (`toFigmaCollections`) on a default theme, so a new or renamed token
 * group fails here, at the CLI, rather than as a drift warning during an import.
 */
describe('figmaVariableScopes covers every generated token', () => {
  it('matches a rule for all variables in all collections', async () => {
    const themeName = 'test';
    const config = configSchema.parse({
      themes: { [themeName]: { colors: { neutral: '#444444', brand: '#0062BA' } } },
    });
    const theme = { name: themeName, ...config.themes[themeName] } as Theme;
    const dimensions = getTokenSetDimensions(theme);
    const { tokenSets } = await createTokens(theme, dimensions);
    const $themes = await generate$Themes(dimensions, [themeName], toColorNames(theme.colors));

    const unmatched: string[] = [];
    let checked = 0;
    for (const [collection, modes] of Object.entries(toFigmaCollections($themes, tokenSets))) {
      for (const mode of modes) {
        for (const { tokenSet, exists } of mode.tokenSets) {
          // Mirrors the plugin: `primitives/globals` is source-only, and line-heights and
          // letter-spacings are written on text styles rather than as variables.
          if (!exists || tokenSet === 'primitives/globals') continue;
          for (const { path, type } of flattenTokens(tokenSets.get(tokenSet) as TokenSet)) {
            if (!figmaVariableType(type) || type === 'lineHeights' || type === 'letterSpacing') continue;
            checked++;
            if (figmaVariableScopes(collection, { path, type }) === null) {
              unmatched.push(`${collection}: ${tokenSet} ${path.join('.')} (${type})`);
            }
          }
        }
      }
    }

    expect(checked).toBeGreaterThan(100);
    expect(unmatched).toEqual([]);
  });
});

const flattenTokens = (tokens: TokenSet, path: string[] = []): { path: string[]; type: string }[] =>
  Object.entries(tokens).flatMap(([key, value]) =>
    '$value' in value
      ? [{ path: [...path, key], type: String(value.$type) }]
      : flattenTokens(value as TokenSet, [...path, key]),
  );
