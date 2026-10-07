// The import log has two channels: `info` for what was done (created, renamed, deleted, ...)
// and `warnings` for what was skipped or could not be applied. The UI shows warnings after an
// otherwise successful import; both are posted so a hard failure still carries the partial log.

export type ImportLog = {
  info: string[];
  warnings: string[];
};

export const createImportLog = (): ImportLog => ({ info: [], warnings: [] });

// Names of the fields that differ between two snapshots of the same Figma object, taken before
// and after the import writes to it. Both come from Figma, so unchanged values compare equal.
export function changedFields(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): string[] {
  const names = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...names].filter(
    (name) => JSON.stringify(before[name]) !== JSON.stringify(after[name]),
  );
}
