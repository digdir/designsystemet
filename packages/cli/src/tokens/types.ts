import type { Config as SDConfig } from 'style-dictionary/types';
import type { ConfigSchemaTheme } from '../config.js';
import type { GetStyleDictionaryConfig } from './process/configs/shared.js';

export type Token =
  | { $value: string | Record<string, string>[]; $type: string }
  | { $type: 'boxShadow'; $value: Record<'x' | 'y' | 'blur' | 'spread' | 'color', string>[] }
  | {
      $type: 'typography';
      $value: Record<'fontFamily' | 'fontWeight' | 'lineHeight' | 'fontSize' | 'letterSpacing', string>;
    };

export type TokenSet = {
  [key: string]: Token | TokenSet;
};
export type TokenSets = Map<string, TokenSet>;

export type Colors = Theme['colors'];
export type Typography = Theme['typography'];

export type Theme = {
  name: string;
} & Required<Omit<ConfigSchemaTheme, 'overrides'>> &
  Pick<ConfigSchemaTheme, 'overrides'>;

export const colorCategories = {
  main: 'main',
  support: 'support',
} as const;

export type ColorCategories = keyof typeof colorCategories;

export type BuiltInColors = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type SizeModes = 'small' | 'medium' | 'large';

/**
 * A multi-dimensional theme is a concrete permutation of the possible theme dimensions
 */
export type ThemePermutation = {
  'color-scheme': string;
  'main-color': string;
  'support-color'?: string;
  semantic: string;
  size: string;
  theme: string;
  typography: string;
};

export type ThemeDimension = keyof ThemePermutation;

export type GetSDConfigOptions = {
  tokensDir?: string;
  dry?: boolean;
  tokenSets?: TokenSets;
};

export type BuildConfig = {
  /** Optional name of the build config - only used in the console output */
  name?: string;
  /** Style Dictionary configuration creator */
  getConfig: GetStyleDictionaryConfig;
  /** Which theme dimensions to include. `theme` (e.g. digdir/altinn) is always included. */
  dimensions: ThemeDimension[];
  /** Whether the build config is enabled. @default () => true */
  enabled?: () => boolean;
  /** Custom log message. */
  log?: (config: SDConfigForThemePermutation) => string;
};

export type SDConfigForThemePermutation = { permutation: ThemePermutation; config: SDConfig };

/** This type is taken from Style Dictionary `formatPlatform` */
export type OutputFile = {
  output: string;
  destination: string;
};

export type DesignsystemetObject = {
  name: string;
  version: string;
};
