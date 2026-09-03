import type {
  FigmaCollections,
  ThemeObjectInput,
} from '@digdir/designsystemet/tokens/create';
import type { TokenSets } from '@digdir/designsystemet/tokens/types';

// Input to buildTokenModel: the generated token sets keyed by token set path
// (e.g. `semantic/color/neutral`) and the `$themes` entries that group them.
export type TokenInput = {
  tokenSets: TokenSets;
  $themes: ThemeObjectInput[];
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

export type ThemeOption = {
  name: string;
  tokenSets: string[];
};

// Import-side model. Stays on the plugin side (importer, collection specs,
// text/effect styles, resolver) and is never posted to the UI.
export type TokenModel = {
  tokenSets: Array<{
    path: string;
  }>;
  flatTokens: FlatToken[];
  // `$themes.json` grouped into Figma collections by the CLI's toFigmaCollections.
  // This is the source of truth for collections/modes; `themes` is the same data
  // flattened for lookups.
  figmaCollections: FigmaCollections;
  themes: ModePreview[];
  collections: CollectionPreview[];
  themeOptions: ThemeOption[];
  colorSchemeOptions: ThemeOption[];
  warnings: string[];
};

// UI-side preview model. All values are resolved ahead of time on the plugin
// side — one entry per theme/scheme combination, keyed by previewVariantKey()
// — so the UI renders by lookup and needs no token resolver.
export type SemanticColorRole = {
  name: string;
  // CSS color per preview variant; null when the value could not be resolved.
  color: Record<string, string | null>;
};

export type SemanticColorScale = {
  name: string;
  roles: SemanticColorRole[];
};

export type BorderRadiusPreview = {
  name: string;
  values: Record<string, { px: number | null; label: string }>;
};

export type FontFamilyPreview = {
  name: string;
  values: Record<string, { family: string | null; label: string }>;
};

export type PreviewData = {
  themeOptions: string[];
  colorSchemeOptions: string[];
  semanticColorScales: SemanticColorScale[];
  borderRadii: BorderRadiusPreview[];
  fontFamilies: FontFamilyPreview[];
  warnings: string[];
};
