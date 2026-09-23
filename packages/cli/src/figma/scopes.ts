import { FIGMA_COLLECTION } from './collections.ts';

/**
 * How generated tokens map onto Figma variables: the variable type per token `$type`, and the
 * scopes per (collection, token). Keyed on token type and path group rather than on variable
 * names, so a renamed token keeps its scopes. `scopes.test.ts` asserts the rules cover every
 * token `tokens create` generates, so a new token group fails CI here instead of surfacing as a
 * drift warning in the Figma plugin.
 */

/** The Figma variable types tokens map onto. A subset of Figma's `VariableResolvedDataType`. */
export type FigmaVariableType = 'COLOR' | 'FLOAT' | 'STRING';

/** The Figma variable scopes the rules assign. A subset of Figma's `VariableScope`. */
export type FigmaVariableScope =
  | 'ALL_SCOPES'
  | 'CORNER_RADIUS'
  | 'FONT_FAMILY'
  | 'FONT_SIZE'
  | 'FONT_STYLE'
  | 'GAP'
  | 'OPACITY'
  | 'STROKE_FLOAT'
  | 'WIDTH_HEIGHT';

export type FigmaVariableToken = {
  /** Token path within its set, e.g. `['border-radius', 'sm']`. */
  path: readonly string[];
  /** The token `$type`, e.g. `dimension`. */
  type: string | null | undefined;
};

/** The Figma variable type for a token `$type`, or null when the token never becomes a variable. */
export function figmaVariableType(type: string | null | undefined): FigmaVariableType | null {
  switch (type) {
    case 'color':
      return 'COLOR';
    case 'dimension':
    case 'number':
    case 'borderWidth':
    case 'opacity':
    case 'fontSizes':
    case 'lineHeights':
    case 'letterSpacing':
      return 'FLOAT';
    case 'fontFamilies':
    case 'fontWeights':
    case 'text':
      return 'STRING';
    default:
      return null;
  }
}

/**
 * Tokens with a `_`-prefixed path segment (e.g. `_size.base`, `size._step`) are private: they only
 * feed other variables and intentionally get neither scopes nor code syntax.
 */
export const isPrivateTokenPath = (path: readonly string[]): boolean => path.some((segment) => segment.startsWith('_'));

/**
 * The scopes a variable should have, `[]` when it intentionally has none (private tokens, raw
 * theme inputs, per-mode values), or `null` when no rule matched, which is a naming-drift signal.
 *
 * @param collection The Figma collection, one of {@link FIGMA_COLLECTION}.
 */
export function figmaVariableScopes(collection: string, token: FigmaVariableToken): FigmaVariableScope[] | null {
  const { THEME, COLOR_SCHEME, SEMANTIC, COLOR, SIZE, TYPOGRAPHY } = FIGMA_COLLECTION;
  const [group] = token.path;

  if (isPrivateTokenPath(token.path)) return [];

  switch (figmaVariableType(token.type)) {
    case 'COLOR':
      // ALL_SCOPES for a COLOR variable covers exactly the color fields (fills, strokes, effects).
      if (collection === SEMANTIC || collection === COLOR) return ['ALL_SCOPES'];
      // The raw color scales and their per-scheme values are only referenced by other variables.
      if (collection === THEME || collection === COLOR_SCHEME) return [];
      return null;

    case 'FLOAT':
      if (token.type === 'fontSizes' && collection === SIZE) return ['FONT_SIZE'];
      if (token.type === 'borderWidth' && collection === SEMANTIC) return ['STROKE_FLOAT'];
      if (token.type === 'opacity' && collection === SEMANTIC) return ['OPACITY'];
      if (group === 'border-radius') {
        if (collection === SEMANTIC) return ['CORNER_RADIUS'];
        // The border-radius base, scale and steps are inputs to the semantic radii, not for direct use.
        if (collection === THEME) return [];
      }
      if (group === 'size' && collection === SEMANTIC) return ['GAP', 'WIDTH_HEIGHT'];
      return null;

    case 'STRING':
      if (collection === THEME) {
        if (token.type === 'fontWeights') return ['FONT_STYLE'];
        if (token.type === 'fontFamilies') return ['FONT_FAMILY'];
      }
      // Per-set font values, referenced by the Theme collection.
      if (collection === TYPOGRAPHY) return [];
      return null;

    default:
      return null;
  }
}
