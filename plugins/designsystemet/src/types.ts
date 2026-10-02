// UI -> plugin: validate the pasted config, create its tokens and export them to Figma.
type ExportConfigToFigma = {
  type: 'export-config-to-figma';
  config: string;
};

// Plugin -> UI: sent before each step of the export, so the UI can show progress.
type ExportProgress = {
  type: 'export-progress';
  /** 1-based number of the step that is starting. */
  step: number;
  total: number;
  label: string;
};

// Plugin -> UI: sent once when the export has finished or failed.
type ExportResult = {
  type: 'export-result';
  status: 'success' | 'error';
  message: string;
  // What the export did (created, renamed, deleted, ...).
  info?: string[];
  // What was skipped or could not be applied (unresolved aliases, skipped styles, rejected scopes, ...).
  warnings?: string[];
};

// UI -> plugin: open a URL in the user's browser. Links in the plugin UI can't do this themselves.
type OpenExternal = {
  type: 'open-external';
  url: string;
};

export type FigmaMessages =
  | ExportConfigToFigma
  | ExportProgress
  | ExportResult
  | OpenExternal;

export type Notification = {
  kind: 'success' | 'error' | 'warning' | 'info';
  text: string;
  // Optional extra lines (e.g. the list of warnings).
  details?: string[];
};
