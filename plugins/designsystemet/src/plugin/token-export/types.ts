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
  tokenLookup: Map<string, FlatToken>;
  themes: ModePreview[];
  collections: CollectionPreview[];
  themeOptions: ThemeOption[];
  colorSchemeOptions: ThemeOption[];
  semanticColorScales: SemanticColorScale[];
  borderRadii: BorderRadiusPreview[];
  warnings: string[];
};

export type SerializedPreviewData = Omit<PreviewData, 'tokenLookup'> & {
  tokenLookupEntries: Array<[string, FlatToken]>;
};

export type UiState = {
  preview: PreviewData | null;
  selectedTheme: string | null;
  selectedScheme: string | null;
  isImporting: boolean;
  // Migrated config text awaiting the user's confirmation, set when a pasted config
  // still uses the legacy main/support color categories. Null when no prompt is shown.
  pendingLegacyConfig: string | null;
  // Status of the Figma file's color variable structure. Null until the first check
  // from the plugin code returns. When state is not 'ok', import is blocked.
  variableStructure: VariableStructureStatus | null;
  isPreparingVariables: boolean;
  // The dismissible banner shown under the header. Null when no banner is shown.
  notification: Notification | null;
};

export type Notification = {
  kind: 'success' | 'error' | 'warning' | 'info';
  text: string;
  // Optional extra lines (e.g. the list of preview warnings).
  details?: string[];
};

export type VariableStructureStatus = {
  state: 'ok' | 'needs-prepare' | 'ambiguous';
  hasMainColor: boolean;
  hasSupportColor: boolean;
  hasColor: boolean;
  message: string;
};
