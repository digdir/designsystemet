import * as R from 'ramda';
import { generate$Themes } from './create/generators/$themes.js';
import { createTokens } from './create.js';
import { createThemeCSSFiles } from './process/output/theme.js';
import { type FormatOptions, processPlatform } from './process/platform.js';
import { processThemeObject } from './process/utils/getMultidimensionalThemes.js';
import type { ThemeConfig, TokenSetDimensionsForAllThemes } from './types.js';

export const formatTokens = async (options: Omit<FormatOptions, 'type' | 'buildTokenFormats'>) => {
  const processedBuilds = await processPlatform({
    type: 'format',
    buildTokenFormats: {},
    ...options,
  });

  return processedBuilds;
};

export const formatTheme = async (themeConfig: ThemeConfig) => {
  const { tokenSets, themeDimensions } = createTokens(themeConfig);

  const tokenSetThemeDimensions: TokenSetDimensionsForAllThemes = {
    colorSchemes: themeDimensions.colorSchemes,
    sizeModes: themeDimensions.sizeModes,
    fontNamesPerTheme: { [themeConfig.name]: themeDimensions.fontNames },
    colorsPerTheme: { [themeConfig.name]: themeConfig.colors },
  };

  const $themes = await generate$Themes(tokenSetThemeDimensions, [themeConfig.name]);
  const processed$themes = $themes.map(processThemeObject);

  const processedBuilds = await formatTokens({
    tokenSets,
    processed$themes,
    verbose: false,
  });

  return processedBuilds;
};

/**
 * Formats a theme configuration into CSS.
 *
 * This function takes a `Theme` configuration object, processes it using the
 * `formatTheme` function, and then generates CSS using the `createThemeCSS` function.
 *
 * @param themeConfig - The theme configuration object to be formatted.
 * @returns A promise that resolves to the generated CSS string.
 */
export const formatThemeCSS = async (themeConfig: ThemeConfig) => {
  const processedBuilds = await formatTheme(themeConfig);
  const themeCSSFiles = createThemeCSSFiles({ processedBuilds });
  return R.head(themeCSSFiles)?.output ?? '';
};
