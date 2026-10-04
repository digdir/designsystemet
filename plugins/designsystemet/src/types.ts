// UI -> plugin: validate the pasted config, create its tokens and sync them to Figma.
type SyncConfigToFigma = {
  type: 'sync-config-to-figma';
  config: string;
};

// Plugin -> UI: sent before each step of the sync, so the UI can show progress.
type SyncProgress = {
  type: 'sync-progress';
  /** 1-based number of the step that is starting. */
  step: number;
  total: number;
  label: string;
};

// Plugin -> UI: sent once when the sync has finished or failed.
type SyncResult = {
  type: 'sync-result';
  status: 'success' | 'error';
  message: string;
  // What the sync did (created, renamed, deleted, ...).
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
  | SyncConfigToFigma
  | SyncProgress
  | SyncResult
  | OpenExternal;

export type Notification = {
  kind: 'error' | 'warning' | 'info';
  text: string;
  // Optional extra lines (e.g. the list of warnings).
  details?: string[];
};
