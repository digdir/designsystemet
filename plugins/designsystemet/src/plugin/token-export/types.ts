export type LoadedFile = {
  path: string;
  tokenSetPath: string;
  data: unknown;
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
  }>;
};

export type CollectionPreview = {
  name: string;
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

export type FontFamilyPreview = {
  name: string;
  path: string;
  // A `{reference}` to the token path rather than a copied raw value, so the UI
  // resolves it against the active token sets and follows the selected theme.
  value: string;
};

export type ThemeOption = {
  name: string;
  tokenSets: string[];
};

export type PreviewData = {
  tokenSets: Array<{
    path: string;
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
  fontFamilies: FontFamilyPreview[];
  warnings: string[];
};
