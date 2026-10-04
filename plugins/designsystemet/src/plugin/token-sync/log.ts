// The export log has two channels: `info` for what was done (created, renamed, deleted, ...)
// and `warnings` for what was skipped or could not be applied. The UI shows warnings after an
// otherwise successful export; both are posted so a hard failure still carries the partial log.

export type ExportLog = {
  info: string[];
  warnings: string[];
};

export const createExportLog = (): ExportLog => ({ info: [], warnings: [] });
