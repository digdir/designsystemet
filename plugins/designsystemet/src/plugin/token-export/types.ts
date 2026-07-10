export type LoadedFile = {
  path: string;
  tokenSetPath: string;
  size: number;
  data: unknown | null;
  error?: string;
};

export type FlatToken = {
  tokenSet: string;
  path: string;
  figmaName: string;
  type: string | null;
  value: unknown;
  references: string[];
};

export type ModePreview = {
  id: string | null;
  name: string;
  group: string;
  selectedTokenSets: Array<{
    tokenSet: string;
    status: string;
    exists: boolean;
    tokenCount: number;
  }>;
};

export type CollectionPreview = {
  name: string;
  modes: Array<{
    name: string;
    tokenSets: string[];
  }>;
  variablePreview: Array<{
    name: string;
    type: string;
  }>;
};

export type SemanticColorScale = {
  name: string;
  roles: Array<{
    name: string;
    path: string;
    value: unknown;
  }>;
};

export type BorderRadiusPreview = {
  name: string;
  path: string;
  value: unknown;
};

export type ThemeOption = {
  name: string;
  tokenSets: string[];
};

export type PreviewData = {
  generatedAt: string;
  rootName: string | null;
  summary: {
    files: number;
    validFiles: number;
    tokenSets: number;
    themes: number;
    colorSchemes: number;
    semanticColorScales: number;
    borderRadii: number;
    warnings: number;
  };
  tokenSets: Array<{
    path: string;
    filePath: string;
    tokenCount: number;
    types: Record<string, number>;
  }>;
  flatTokens: FlatToken[];
  // Plain object (not Map) so it survives figma.ui.postMessage serialization to the UI.
  tokenLookup: Record<string, FlatToken>;
  themes: ModePreview[];
  collections: CollectionPreview[];
  themeOptions: ThemeOption[];
  colorSchemeOptions: ThemeOption[];
  semanticColorScales: SemanticColorScale[];
  borderRadii: BorderRadiusPreview[];
  warnings: string[];
};
