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

// UI -> plugin: list the migrations, and which have been applied to this file.
type ListMigrations = {
  type: 'list-migrations';
};

// Plugin -> UI: the migrations, oldest first.
type MigrationsList = {
  type: 'migrations-list';
  migrations: MigrationInfo[];
};

// UI -> plugin: preview (dryRun) or apply the chosen migrations. They run oldest first, whatever the order here.
type RunMigrations = {
  type: 'run-migrations';
  ids: string[];
  dryRun: boolean;
};

// Plugin -> UI: what the migrations would change (dryRun) or changed.
type MigrationsResult = {
  type: 'migrations-result';
  dryRun: boolean;
  status: 'success' | 'error';
  /** One per migration that ran, oldest first. */
  summaries: MigrationSummary[];
  /** The name of the version saved to the file's version history before the migrations were applied, if one was. */
  savedVersion?: string;
  /** What went wrong, on error. */
  message?: string;
};

// UI -> plugin: stamp the pages and components of the UI kit's source file, so migrations find them in copies
// even after they're renamed. For maintainers; see plugin/stamps/stamps.ts. The result is shown with figma.notify.
type StampUiKit = {
  type: 'stamp-ui-kit';
};

// UI -> plugin: how much of this file is stamped, for the Stamp UI kit card.
type GetStampStatus = {
  type: 'get-stamp-status';
};

// Plugin -> UI: how many pages are stamped. Sent when asked, and when stamping finished or failed.
type StampStatus = {
  type: 'stamp-status';
  stampedPages: number;
};

export type MigrationInfo = {
  id: string;
  title: string;
  description: string;
  /** When the migration was applied to this file, as an ISO date, if it has been. */
  appliedAt?: string;
  /** Whether the file has any of the UI kit pages the migration changes, so it has something to migrate. */
  inFile: boolean;
};

/** One kind of change in a component, in words, e.g. Border: neutral border-subtle → border-muted. */
export type MigrationChangeSummary = {
  /** What on the layers changes: Fill, Border, Text or Color mode. */
  what: string;
  from: string;
  to: string;
  /** How many times: one per layer, or per text range in text with several colors. */
  count: number;
};

export type MigrationSummary = {
  id: string;
  title: string;
  /** The changes, by component, sorted by name. Each page in the UI kit is one component. */
  components: Array<{ name: string; changes: MigrationChangeSummary[] }>;
  /** The number of changes made, or that would be. A layer whose fill and border both change counts twice. */
  total: number;
  /** What was skipped, e.g. components that aren't in the file. */
  warnings: string[];
  /** Why the migration can't run, e.g. variables it needs are missing. Nothing is changed. */
  error?: string;
};

export type FigmaMessages =
  | ImportConfig
  | ImportProgress
  | ImportResult
  | ConvertCss
  | ConvertCssResult
  | ExportConfig
  | ExportConfigResult
  | OpenExternal
  | ListMigrations
  | MigrationsList
  | RunMigrations
  | MigrationsResult
  | StampUiKit
  | GetStampStatus
  | StampStatus;

export type Notification = {
  kind: 'error' | 'warning' | 'info';
  text: string;
  // Optional extra lines (e.g. the list of warnings).
  details?: string[];
};
