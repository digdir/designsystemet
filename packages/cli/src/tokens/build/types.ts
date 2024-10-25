import type SD from 'style-dictionary/types';
import type { GetStyleDictionaryConfig } from './configs';

/**
 * A multi-dimensional theme is a concrete permutation of the possible theme dimensions
 */
export type ThemePermutation = {
  mode: string;
  'main-color': string;
  'support-color': string;
  semantic: string;
  size: string;
  theme: string;
  typography: string;
};

export type ThemeDimension = keyof ThemePermutation;

export type IsCalculatedToken = (token: SD.TransformedToken, options?: SD.Config) => boolean;

export type GetSdConfigOptions = {
  outPath: string;
  tokensDir: string;
};

export type BuildConfig = {
  /** Optional name of the build config - only used in the console output */
  name?: string;
  /** Style Dictionary configuration creator */
  getConfig: GetStyleDictionaryConfig;
  /** Which theme dimensions to include. `theme` (e.g. digdir/altinn) is always included. */
  dimensions: ThemeDimension[];
  /** Custom options used when creating Style Dictionary configs. If not supplied, the default is used */
  options?: Partial<GetSdConfigOptions>;
  /** Custom build function. If not supplied, the default is used. */
  build?: (sdConfigs: SDConfigForThemePermutation[], options: GetSdConfigOptions) => Promise<void>;
};

export type SDConfigForThemePermutation = { permutation: ThemePermutation; config: SD.Config };
