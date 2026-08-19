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
