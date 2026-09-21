// Figma variable scopes, derived when the variable specs are built (see `collection-specs.ts`)
// and applied together with the WEB code syntax when the variables are synced. The rules are
// keyed on (collection name, resolved type, variable name).

import { FIGMA_COLLECTION } from '@digdir/designsystemet/internal';

/**
 * Tokens with a `_`-prefixed path segment (e.g. `_size.base`, `size._step`) are private: they
 * only feed other variables and intentionally get neither scopes nor code syntax.
 */
export const isPrivateToken = (path: string): boolean =>
  path.split('.').some((segment) => segment.startsWith('_'));

/**
 * The scopes a variable should have, `[]` when it intentionally has none (raw theme inputs,
 * per-mode values), or `null` when no rule matched, which is a naming-drift signal.
 */
export function getScopes(
  collectionName: string,
  resolvedType: VariableResolvedDataType,
  variableName: string,
): VariableScope[] | null {
  const fullName = variableName.toLowerCase();

  if (resolvedType === 'COLOR') {
    if (
      collectionName === FIGMA_COLLECTION.SEMANTIC ||
      collectionName === FIGMA_COLLECTION.COLOR
    ) {
      // ALL_SCOPES for a COLOR variable covers exactly the color fields (fills, strokes,
      // effects). Cannot be combined with other scopes.
      return ['ALL_SCOPES'];
    }
    if (
      collectionName === FIGMA_COLLECTION.THEME ||
      collectionName === FIGMA_COLLECTION.COLOR_SCHEME
    ) {
      // The raw color scales and their per-scheme values are only referenced by other variables.
      return [];
    }
    return null;
  }

  if (resolvedType === 'FLOAT') {
    if (
      collectionName === FIGMA_COLLECTION.SIZE &&
      fullName.includes('font-size/')
    ) {
      return ['FONT_SIZE'];
    }
    if (collectionName === FIGMA_COLLECTION.SEMANTIC) {
      if (fullName.includes('opacity')) return ['OPACITY'];
      if (fullName.includes('border-width')) return ['STROKE_FLOAT'];
      if (fullName.includes('border-radius')) return ['CORNER_RADIUS'];
      if (fullName.includes('size/')) return ['GAP', 'WIDTH_HEIGHT'];
    }
    if (
      collectionName === FIGMA_COLLECTION.THEME &&
      fullName.includes('border-radius')
    ) {
      // The border-radius base, scale and steps are inputs to the semantic radii, not for direct use.
      return [];
    }
    return null;
  }

  if (resolvedType === 'STRING') {
    if (collectionName === FIGMA_COLLECTION.THEME) {
      if (fullName.includes('font-weight/')) return ['FONT_STYLE'];
      if (fullName === 'font-family') return ['FONT_FAMILY'];
    }
    if (collectionName === FIGMA_COLLECTION.TYPOGRAPHY) {
      // Per-set font values, referenced by the Theme collection.
      return [];
    }
    return null;
  }

  return null;
}

export function normalizeScopes(scopes: readonly VariableScope[]): string {
  return [...scopes].sort().join('|');
}
