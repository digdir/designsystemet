import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';
import { describe, expect, it, vi } from 'vitest';
import type { TokenSet, TokenSets } from '../types.ts';
import { mergeTokenSets, toFigmaCollections, UNGROUPED } from './figma-collections.ts';

const color = (value: string) => ({ $type: 'color', $value: value });
const dimension = (value: string) => ({ $type: 'dimension', $value: value });

function themeObject(group: string | undefined, name: string, sets: Record<string, TokenSetStatus>): ThemeObject {
  return { id: `${group}-${name}`, name, group, selectedTokenSets: sets };
}

function fixture(): { $themes: ThemeObject[]; tokenSets: TokenSets } {
  const tokenSets: TokenSets = new Map<string, TokenSet>([
    ['primitives/globals', { 'border-width': { 1: dimension('1px') } }],
    ['primitives/modes/size/small', { size: { base: dimension('14px') } }],
    ['primitives/modes/size/global', { size: { step: dimension('4px') } }],
    ['primitives/modes/color-scheme/light/digdir', { theme: { accent: { 1: color('#fff') } } }],
    ['primitives/modes/color-scheme/light/altinn', { theme: { accent: { 1: color('#fafafa'), 2: color('#eee') } } }],
    ['primitives/modes/color-scheme/dark/digdir', { theme: { accent: { 1: color('#000') } } }],
    ['themes/digdir', { 'font-family': { $type: 'fontFamilies', $value: 'Inter' } }],
    ['semantic/style', { 'border-radius': { md: dimension('{border-radius.2}') } }],
  ]);

  const $themes = [
    themeObject('Size', 'small', {
      'primitives/modes/size/small': TokenSetStatus.SOURCE,
      'primitives/modes/size/global': TokenSetStatus.ENABLED,
    }),
    themeObject('Theme', 'digdir', { 'themes/digdir': TokenSetStatus.ENABLED }),
    themeObject('Color scheme', 'Light', {
      'primitives/modes/color-scheme/light/digdir': TokenSetStatus.ENABLED,
      'primitives/modes/color-scheme/light/altinn': TokenSetStatus.ENABLED,
    }),
    themeObject('Color scheme', 'Dark', {
      'primitives/modes/color-scheme/dark/digdir': TokenSetStatus.ENABLED,
      'primitives/modes/color-scheme/dark/altinn': TokenSetStatus.ENABLED, // no file
    }),
    themeObject('Semantic', 'Semantic', {
      'semantic/style': TokenSetStatus.ENABLED,
      'primitives/globals': TokenSetStatus.SOURCE,
      'semantic/disabled': TokenSetStatus.DISABLED,
    }),
  ];

  return { $themes, tokenSets };
}

describe('toFigmaCollections', () => {
  it('groups modes by their $themes group, preserving order', () => {
    const { $themes, tokenSets } = fixture();
    const collections = toFigmaCollections($themes, tokenSets);

    expect(Object.keys(collections)).toEqual(['Size', 'Theme', 'Color scheme', 'Semantic']);
    expect(collections['Color scheme'].map((m) => m.modeName)).toEqual(['Light', 'Dark']);
    expect(collections.Theme).toEqual([
      {
        id: 'Theme-digdir',
        modeName: 'digdir',
        tokenSets: [{ tokenSet: 'themes/digdir', status: TokenSetStatus.ENABLED, exists: true }],
        tokens: { 'font-family': { $type: 'fontFamilies', $value: 'Inter' } },
      },
    ]);
  });

  it('lists every selected token set with status and existence, regardless of status', () => {
    const { $themes, tokenSets } = fixture();
    const semantic = toFigmaCollections($themes, tokenSets).Semantic[0];

    expect(semantic.tokenSets).toEqual([
      { tokenSet: 'semantic/style', status: TokenSetStatus.ENABLED, exists: true },
      { tokenSet: 'primitives/globals', status: TokenSetStatus.SOURCE, exists: true },
      { tokenSet: 'semantic/disabled', status: TokenSetStatus.DISABLED, exists: false },
    ]);
  });

  it('deep-merges all enabled token sets of a mode, later sets winning', () => {
    const { $themes, tokenSets } = fixture();
    const light = toFigmaCollections($themes, tokenSets)['Color scheme'][0];

    expect(light.tokens).toEqual({
      theme: { accent: { 1: color('#fafafa'), 2: color('#eee') } },
    });
  });

  it('excludes source sets from tokens by default and includes them on request', () => {
    const { $themes, tokenSets } = fixture();

    expect(toFigmaCollections($themes, tokenSets).Size[0].tokens).toEqual({
      size: { step: dimension('4px') },
    });
    expect(toFigmaCollections($themes, tokenSets).Semantic[0].tokens).not.toHaveProperty('border-width');

    const withSource = toFigmaCollections($themes, tokenSets, { includeSource: true });
    expect(withSource.Size[0].tokens).toEqual({
      size: { base: dimension('14px'), step: dimension('4px') },
    });
    expect(withSource.Semantic[0].tokens).toHaveProperty('border-width');
  });

  it('never merges disabled sets and reports missing ones', () => {
    const { $themes, tokenSets } = fixture();
    const onMissingTokenSet = vi.fn();

    const collections = toFigmaCollections($themes, tokenSets, { includeSource: true, onMissingTokenSet });

    expect(onMissingTokenSet.mock.calls.map(([set, theme]) => [set, theme.name])).toEqual([
      ['primitives/modes/color-scheme/dark/altinn', 'Dark'],
      ['semantic/disabled', 'Semantic'],
    ]);
    expect(collections['Color scheme'][1].tokens).toEqual({ theme: { accent: { 1: color('#000') } } });
    expect(collections['Color scheme'][1].tokenSets[1]).toEqual({
      tokenSet: 'primitives/modes/color-scheme/dark/altinn',
      status: TokenSetStatus.ENABLED,
      exists: false,
    });
  });

  it('collects entries without a group under UNGROUPED and tolerates a missing id', () => {
    const collections = toFigmaCollections(
      [{ name: 'loose', selectedTokenSets: { 'themes/digdir': TokenSetStatus.ENABLED } }],
      fixture().tokenSets,
    );
    expect(Object.keys(collections)).toEqual([UNGROUPED]);
    expect(collections[UNGROUPED][0]).toMatchObject({ id: null, modeName: 'loose' });
  });

  it('produces an empty mode when nothing is selected', () => {
    const collections = toFigmaCollections([themeObject('Empty', 'none', {})], new Map());
    expect(collections.Empty).toEqual([{ id: 'Empty-none', modeName: 'none', tokenSets: [], tokens: {} }]);
  });
});

describe('mergeTokenSets', () => {
  it('merges nested groups and replaces tokens whole', () => {
    const base: TokenSet = {
      a: { x: color('#111'), y: color('#222') },
      keep: color('#333'),
    };
    const override: TokenSet = {
      a: { y: { $type: 'color', $value: '#999' }, z: color('#444') },
    };

    expect(mergeTokenSets(base, override)).toEqual({
      a: { x: color('#111'), y: color('#999'), z: color('#444') },
      keep: color('#333'),
    });
  });

  it('lets a token replace a group and vice versa', () => {
    expect(mergeTokenSets({ a: { b: color('#1') } }, { a: color('#2') })).toEqual({ a: color('#2') });
    expect(mergeTokenSets({ a: color('#2') }, { a: { b: color('#1') } })).toEqual({ a: { b: color('#1') } });
  });

  it('does not mutate its inputs', () => {
    const base: TokenSet = { a: { b: color('#1') } };
    const override: TokenSet = { a: { c: color('#2') } };
    mergeTokenSets(base, override);
    expect(base).toEqual({ a: { b: color('#1') } });
    expect(override).toEqual({ a: { c: color('#2') } });
  });
});
