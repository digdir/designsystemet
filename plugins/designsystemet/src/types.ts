import type { PreviewData } from './plugin/token-export/types';

type ImportConfig = {
  type: 'import-config-and-create-preview-tokens';
  config: string;
};

type PreviewTokensFromConfig = {
  type: 'preview-tokens-from-config';
  status: 'success' | 'error';
  message: string;
  preview?: {
    previewData: PreviewData;
    colorNames: string[];
    themeNames: string[];
  };
};

type ExportTokensToFigma = {
  type: 'export-tokens-to-figma';
  status: 'exporting' | 'success' | 'error';
  message: string;
  logs?: string[];
};

export type FigmaMessages =
  | ImportConfig
  | PreviewTokensFromConfig
  | ExportTokensToFigma;

export type UiState = {
  previewData: PreviewData | null;
  selectedTheme: string | null;
  selectedScheme: string | null;
  isImporting: boolean;
  notification: Notification | null;
};

export type Notification = {
  kind: 'success' | 'error' | 'warning' | 'info';
  text: string;
  // Optional extra lines (e.g. the list of preview warnings).
  details?: string[];
};
