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
  /** Shown with the step, e.g. to warn that Figma may stop responding while it runs. */
  note?: string;
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

// UI -> plugin: create a config from the variables in this file.
type ExtractConfig = {
  type: 'extract-config';
};

// Plugin -> UI: the config created from this file, or why it couldn't be created.
type ExtractConfigResult = {
  type: 'extract-config-result';
  status: 'success' | 'error';
  /** The config as formatted JSON, on success. */
  config?: string;
  /** What went wrong, on error. */
  message?: string;
  /** What is in the file but can't be described by the config, and so is left out of it. */
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
  | ExtractConfig
  | ExtractConfigResult
  | OpenExternal;

export type Notification = {
  kind: 'error' | 'warning' | 'info';
  text: string;
  // Optional extra lines (e.g. the list of warnings).
  details?: string[];
};
