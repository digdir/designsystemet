type CreateTokensFromConfig = {
  type: 'import-config';
  config: string;
};

type CreateTokensFromConfigResult = {
  type: 'import-config-result';
  status: 'success' | 'error';
  message: string;
};

type PreviewTokensFromConfig = {
  type: 'preview-config';
  config: string;
};

type ExportTokensToFigmaVariables = {
  type: 'export-tokens-to-figma';
};

type ExportTokensToFigmaResult = {
  type: 'export-tokens-to-figma-result';
  status: 'exporting' | 'finished' | 'error';
  message: string;
};

export type FigmaMessages =
  | CreateTokensFromConfig
  | CreateTokensFromConfigResult
  | PreviewTokensFromConfig
  | ExportTokensToFigmaVariables
  | ExportTokensToFigmaResult;
