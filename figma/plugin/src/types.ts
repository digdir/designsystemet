// UI -> plugin: validate the pasted config, create its tokens and import them into Figma.
type ImportConfig = {
  type: 'import-config';
  config: string;
};

// Plugin -> UI: sent before each step of the import, so the UI can show progress.
type ImportProgress = {
  type: 'import-progress';
  /** 1-based number of the step that is starting. */
  step: number;
  total: number;
  label: string;
  /** Shown with the step, e.g. to warn that Figma may stop responding while it runs. */
  note?: string;
};

// Plugin -> UI: sent once when the import has finished or failed.
type ImportResult = {
  type: 'import-result';
  status: 'success' | 'error';
  message: string;
  // What the import did (created, renamed, deleted, ...).
  info?: string[];
  // What was skipped or could not be applied (unresolved aliases, skipped styles, rejected scopes, ...).
  warnings?: string[];
  // How long each step, and some parts of steps, took. For debugging slow imports.
  timings?: string[];
};

// UI -> plugin: create a config from theme CSS built by Designsystemet, e.g. designsystemet.css.
type ConvertCss = {
  type: 'convert-css';
  /** One per theme, in the order the themes are in the config. */
  files: CssFile[];
};

export type CssFile = {
  css: string;
  /** The uploaded file's name, which names the theme. Left out for pasted CSS. */
  fileName?: string;
};

// Plugin -> UI: the config created from the CSS files, or why it couldn't be created.
type ConvertCssResult = {
  type: 'convert-css-result';
  status: 'success' | 'error';
  /** The config as formatted JSON, on success. */
  config?: string;
  /** What went wrong, on error. */
  message?: string;
  /** What is in the CSS but can't be described by the config, and so is left out of it. */
  warnings?: string[];
};

// UI -> plugin: create a config from the variables in this file.
type ExportConfig = {
  type: 'export-config';
};

// Plugin -> UI: the config created from this file, or why it couldn't be created.
type ExportConfigResult = {
  type: 'export-config-result';
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
  | ImportConfig
  | ImportProgress
  | ImportResult
  | ConvertCss
  | ConvertCssResult
  | ExportConfig
  | ExportConfigResult
  | OpenExternal;

export type Notification = {
  kind: 'error' | 'warning' | 'info';
  text: string;
  // Optional extra lines (e.g. the list of warnings).
  details?: string[];
};
