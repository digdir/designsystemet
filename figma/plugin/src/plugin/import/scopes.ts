// The scope rules live in the CLI (`figmaVariableScopes` in `@digdir/designsystemet/internal`),
// where a test asserts they cover every generated token. This file only holds the comparison
// helper used when syncing variables.

export function normalizeScopes(scopes: readonly VariableScope[]): string {
  return [...scopes].sort().join('|');
}
