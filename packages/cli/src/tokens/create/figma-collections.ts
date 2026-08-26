import { type ThemeObject, TokenSetStatus } from '@tokens-studio/types';
import type { Token, TokenSet, TokenSets } from '../types.ts';

/** The subset of a `$themes.json` entry the transformer needs. `id` and `group` are optional. */
export type ThemeObjectInput = Pick<ThemeObject, 'name' | 'selectedTokenSets'> &
  Partial<Pick<ThemeObject, 'id' | 'group'>>;

/** A token set selected by a mode in `$themes.json`, and whether it was found in `tokenSets`. */
export type SelectedTokenSet = {
  tokenSet: string;
  status: TokenSetStatus;
  exists: boolean;
};

/** One mode in a Figma variable collection. */
export type FigmaMode = {
  /** `$themes.json` entry id, when present. */
  id: string | null;
  modeName: string;
  /** Every token set the mode selects, in `selectedTokenSets` order, regardless of status. */
  tokenSets: SelectedTokenSet[];
  /** Deep-merge of the mode's existing, non-disabled (and, if enabled, `source`) token sets. */
  tokens: TokenSet;
};

/** Figma collections keyed by `$themes` group name (e.g. "Color scheme"), each a list of modes. */
export type FigmaCollections = Record<string, FigmaMode[]>;

/** Group used for `$themes` entries that have no `group`. */
export const UNGROUPED = '(ungrouped)';

export type ToFigmaCollectionsOptions = {
  /**
   * Include `source` token sets when merging `tokens`.
   * Token Studio uses `source` sets for reference resolution only and does not export
   * them as variables, so they are excluded by default. They are always listed in
   * `tokenSets` so callers can still use them for alias resolution.
   * @default false
   */
  includeSource?: boolean;
  /**
   * Called for every selected token set that has no entry in `tokenSets`.
   * @default () => {} (silently skipped)
   */
  onMissingTokenSet?: (tokenSet: string, theme: ThemeObjectInput) => void;
};

/**
 * Groups `$themes.json` entries by their `group` into Figma collections. Every theme entry
 * becomes one mode in its group's collection, carrying its selected token sets (with
 * status and existence) and the tokens of those sets deep-merged in `selectedTokenSets`
 * order, later sets overriding earlier ones.
 *
 * Entries without a `group` are collected under {@link UNGROUPED}.
 */
export function toFigmaCollections(
  $themes: ThemeObjectInput[],
  tokenSets: TokenSets,
  options: ToFigmaCollectionsOptions = {},
): FigmaCollections {
  const { includeSource = false, onMissingTokenSet = () => {} } = options;
  const collections: FigmaCollections = {};

  for (const theme of $themes) {
    const group = theme.group || UNGROUPED;
    const selected: SelectedTokenSet[] = [];
    let tokens: TokenSet = {};

    for (const [tokenSet, status] of Object.entries(theme.selectedTokenSets ?? {})) {
      const set = tokenSets.get(tokenSet);
      selected.push({ tokenSet, status, exists: set !== undefined });

      if (!set) {
        onMissingTokenSet(tokenSet, theme);
        continue;
      }
      if (status === TokenSetStatus.DISABLED) continue;
      if (status === TokenSetStatus.SOURCE && !includeSource) continue;

      tokens = mergeTokenSets(tokens, set);
    }

    collections[group] ??= [];
    collections[group].push({
      id: theme.id ?? null,
      modeName: theme.name,
      tokenSets: selected,
      tokens,
    });
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
