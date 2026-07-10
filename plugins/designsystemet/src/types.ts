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
