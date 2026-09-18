// Figma variable scopes, derived when the variable specs are built (see `collection-specs.ts`)
// and applied together with the WEB code syntax when the variables are synced. The rules are
// keyed on (collection name, resolved type, variable name).

import { FIGMA_COLLECTION } from '@digdir/designsystemet/internal';

// Collections whose variables are expected to be fully covered by the scope and code syntax
// rules, so a variable there with neither is reported as naming drift.
export const COVERED_COLLECTIONS: string[] = [
  FIGMA_COLLECTION.COLOR,
  FIGMA_COLLECTION.SEMANTIC,
  FIGMA_COLLECTION.SIZE,
  FIGMA_COLLECTION.THEME,
];

export function getScopes(
  collectionName: string,
  resolvedType: VariableResolvedDataType,
  variableName: string,
): VariableScope[] {
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
    return [];
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
    return [];
  }

  if (resolvedType === 'STRING' && collectionName === FIGMA_COLLECTION.THEME) {
    if (fullName.includes('font-weight/')) return ['FONT_STYLE'];
    if (fullName === 'font-family') return ['FONT_FAMILY'];
  }

  return [];
}

export function normalizeScopes(scopes: readonly VariableScope[]): string {
  return [...scopes].sort().join('|');
}
