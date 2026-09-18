// Auto-applies Figma variable scopes after an import, so users get correct scoping out of the
// box without a separate step. The rules are keyed on (collection name, resolved type, variable
// name) and are idempotent. WEB code syntax is set when the variables are created, see
// `collection-specs.ts` and `variable-sync.ts`, from the same naming rules as the CSS build.

import { FIGMA_COLLECTION } from '@digdir/designsystemet/internal';

// Collections whose variables are expected to be fully covered by the scope rules below, so a
// variable there with neither a scope nor a code syntax is reported as naming drift.
const COVERED_COLLECTIONS: string[] = [
  FIGMA_COLLECTION.COLOR,
  FIGMA_COLLECTION.SEMANTIC,
  FIGMA_COLLECTION.SIZE,
  FIGMA_COLLECTION.THEME,
];

// Color scheme and Typography only get scopes, and empty scopes there are intentional.
const SCOPE_COLLECTIONS: string[] = [
  ...COVERED_COLLECTIONS,
  FIGMA_COLLECTION.COLOR_SCHEME,
  FIGMA_COLLECTION.TYPOGRAPHY,
];

function getScopes(
  collectionName: string,
  resolvedType: VariableResolvedDataType,
  fullName: string,
): VariableScope[] {
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

function normalizeScopes(scopes: readonly VariableScope[]): string {
  return [...scopes].sort().join('|');
}

// Sets scopes on all relevant local variables. Best-effort and idempotent: safe to run after
// every import. Appends a short summary to `logs`, plus a few samples of variables in covered
// collections that matched no scope rule and have no code syntax (naming drift).
export async function applyScopes(logs: string[]): Promise<void> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allVariables = await figma.variables.getLocalVariablesAsync();

  if (!collections.some((c) => c.name === FIGMA_COLLECTION.COLOR)) {
    logs.push('Scopes: no Color collection found; skipped.');
    return;
  }

  const variablesByCollectionId = new Map<string, Variable[]>();
  for (const variable of allVariables) {
    const existing = variablesByCollectionId.get(variable.variableCollectionId);
    if (existing) {
      existing.push(variable);
    } else {
      variablesByCollectionId.set(variable.variableCollectionId, [variable]);
    }
  }

  const targetCollections = collections.filter((c) =>
    SCOPE_COLLECTIONS.includes(c.name),
  );

  let scopeChanged = 0;
  let noRuleCount = 0;
  const noRuleSamples: string[] = [];

  for (const collection of targetCollections) {
    const isCovered = COVERED_COLLECTIONS.includes(collection.name);

    for (const variable of variablesByCollectionId.get(collection.id) ?? []) {
      const fullName = variable.name.toLowerCase();
      const scopes = getScopes(
        collection.name,
        variable.resolvedType,
        fullName,
      );
      if (normalizeScopes(scopes) !== normalizeScopes(variable.scopes ?? [])) {
        variable.scopes = scopes;
        scopeChanged++;
      }

      if (isCovered && scopes.length === 0 && !variable.codeSyntax.WEB) {
        noRuleCount++;
        if (noRuleSamples.length < 10) {
          noRuleSamples.push(
            `${collection.name}/${variable.name} (${variable.resolvedType})`,
          );
        }
      }
    }
  }

  logs.push(
    `Scopes: set on ${scopeChanged}, ${noRuleCount} variables without a scope or code syntax.`,
  );
  for (const sample of noRuleSamples) {
    logs.push(`Scopes: no rule matched for ${sample}`);
  }
}
