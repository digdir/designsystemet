import type SD from 'style-dictionary/types';
import type { configs } from './configs';

/**
 * A multi-dimensional theme is a concrete permutation of the possible theme dimensions
 */
export type ThemePermutation = {
  mode: string;
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
  name?: string;
  config: keyof typeof configs;
  modes: ThemeDimension[];
  /** Custom StyleDictionary options. If not supplied, the default is used */
  options?: Partial<GetSdConfigOptions>;
  /** Custom build function. If not supplied, the default is used. */
  build?: (sdConfigs: SDConfigForThemePermutation[], options: GetSdConfigOptions) => Promise<void>;
};

export type SDConfigForThemePermutation = ThemePermutation & { config: SD.Config };
