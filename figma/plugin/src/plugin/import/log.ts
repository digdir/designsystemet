// The import log has three channels: `info` for what was done (created, renamed, deleted, ...),
// `warnings` for what was skipped or could not be applied, and `timings` for how long parts of the
// import took, for debugging slow imports. The UI shows warnings after an otherwise successful
// import; all are posted so a hard failure still carries the partial log.

export type ImportLog = {
  info: string[];
  warnings: string[];
  timings: string[];
};

export const createImportLog = (): ImportLog => ({
  info: [],
  warnings: [],
  timings: [],
});

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
