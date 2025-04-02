import type { Config as SDConfig } from 'style-dictionary/types';
import type { ThemeConfig } from '../config.js';
import type { GetStyleDictionaryConfig } from './process/configs/shared.js';

export type Token = { $value: string | Record<string, string>[]; $type: string };
export type TokensSet = {
  [key: string]: Token | TokensSet;
};

export type Colors = Theme['colors'];
export type Typography = Theme['typography'];

export type Theme = {
  name: string;
} & Required<ThemeConfig>;

export const colorCategories = {
  main: 'main',
  support: 'support',
} as const;

export type ColorCategories = keyof typeof colorCategories;

export type BuiltInColors = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

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
  tokensDir: string;
  dry?: boolean;
  tokenSets?: Map<string, TokensSet>;
};

export type BuildConfig = {
  /** Optional name of the build config - only used in the console output */
  name?: string;
  /** Style Dictionary configuration creator */
  getConfig: GetStyleDictionaryConfig;
  /** Which theme dimensions to include. `theme` (e.g. digdir/altinn) is always included. */
  dimensions: ThemeDimension[];
  /** Custom options used when creating Style Dictionary configs. If not supplied, the default is used */
  options?: Partial<GetSDConfigOptions>;
  /** Custom build function. If not supplied, the default is used. */
  build?: (sdConfigs: SDConfigForThemePermutation[], options: GetSDConfigOptions) => Promise<void>;
  /** Whether the build config is enabled. @default () => true */
  enabled?: () => boolean;
  /** Custom log message. */
  log?: (config: SDConfigForThemePermutation) => string;
};

export type SDConfigForThemePermutation = { permutation: ThemePermutation; config: SDConfig };
