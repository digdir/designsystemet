import type { CreateConfigSchema } from '@digdir/designsystemet/schemas/internal/schema.js';

type ImportConfig = {
  type: 'import-config-and-create-preview-tokens';
  config: string;
};

type PreviewTokensFromConfig = {
  type: 'preview-tokens-from-config';
  status: 'success' | 'error';
  message: string;
  preview?: {
    // The config validated against the internal schema, i.e. with all defaults
    // filled in. The UI renders the preview from this directly.
    config: CreateConfigSchema;
    // Warnings from building the export model (unresolved aliases etc.).
    warnings: string[];
  };
};

type ExportTokensToFigma = {
  type: 'export-tokens-to-figma';
  // Sent by the UI: the theme and color scheme (mode names, e.g. 'Light') selected in
  // the preview. Single-value exports (text/effect styles, raw values) resolve for these.
  theme?: string | null;
  scheme?: string;
  // Sent by the plugin.
  status: 'exporting' | 'success' | 'error';
  message: string;
  logs?: string[];
};

export type FigmaMessages =
  | ImportConfig
  | PreviewTokensFromConfig
  | ExportTokensToFigma;

export type UiState = {
  config: CreateConfigSchema | null;
  selectedTheme: string | null;
  /** Pascal case (e.g. 'Light'/'Dark') to match the Figma variables import, unlike the CLI's lowercase schemes */
  selectedScheme: string;
  isImporting: boolean;
  notification: Notification | null;
};

export type Notification = {
  kind: 'success' | 'error' | 'warning' | 'info';
  text: string;
  // Optional extra lines (e.g. the list of preview warnings).
  details?: string[];
};
