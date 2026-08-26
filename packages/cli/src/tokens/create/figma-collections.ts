import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';
import type { Token, TokenSet, TokenSets } from '../types.ts';

/** One mode in a Figma variable collection: the mode name and its merged tokens. */
export type FigmaMode = {
  modeName: string;
  tokens: TokenSet;
};

/** Figma collections keyed by `$themes` group name (e.g. "Color scheme"), each a list of modes. */
export type FigmaCollections = Map<string, FigmaMode[]>;

export type ToFigmaCollectionsOptions = {
  /**
   * Include `source` token sets in the mode's tokens.
   * Token Studio uses `source` sets for reference resolution only and does not export
   * them as variables, so they are excluded by default.
   * @default false
   */
  includeSource?: boolean;
  /**
   * Called for every selected token set that has no entry in `tokenSets`.
   * @default () => {} (silently skipped)
   */
  onMissingTokenSet?: (tokenSet: string, theme: ThemeObject) => void;
};

/**
 * Groups `$themes.json` entries by their `group` into Figma collections. Every theme entry
 * becomes one mode in its group's collection, with the tokens of its selected token sets
 * deep-merged (in `selectedTokenSets` order, later sets overriding earlier ones).
 *
 * Entries without a `group` are collected under `(ungrouped)`.
 */
export function toFigmaCollections(
  $themes: ThemeObject[],
  tokenSets: TokenSets,
  options: ToFigmaCollectionsOptions = {},
): FigmaCollections {
  const { includeSource = false, onMissingTokenSet = () => {} } = options;
  const collections: FigmaCollections = new Map();

  for (const theme of $themes) {
    const group = theme.group || '(ungrouped)';
    let tokens: TokenSet = {};

    for (const [tokenSet, status] of Object.entries(theme.selectedTokenSets)) {
      if (status === TokenSetStatus.DISABLED) continue;
      if (status === TokenSetStatus.SOURCE && !includeSource) continue;

      const set = tokenSets.get(tokenSet);
      if (!set) {
        onMissingTokenSet(tokenSet, theme);
        continue;
      }
      tokens = mergeTokenSets(tokens, set);
    }

    if (!collections.has(group)) collections.set(group, []);

    collections.get(group)?.push({ modeName: theme.name, tokens });
  }

  return collections;
}

const isToken = (value: Token | TokenSet): value is Token => '$value' in value;

/** Deep-merges two token sets. A token (`$value` node) in `override` replaces the base node whole. */
export function mergeTokenSets(base: TokenSet, override: TokenSet): TokenSet {
  const result: TokenSet = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];
    result[key] =
      existing !== undefined && !isToken(existing) && !isToken(value) ? mergeTokenSets(existing, value) : value;
  }

  return result;
}
