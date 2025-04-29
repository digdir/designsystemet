import * as R from 'ramda';
import { createTokens } from './create.js';
import { generate$Themes } from './create/generators/$themes.js';
import { type FormatOptions, processPlatform } from './process/platform.js';
import { createThemeCSSFiles } from './process/theme.js';
import type { OutputFile, Theme } from './types.js';

export const formatTokens = async (options: Omit<FormatOptions, 'process'>) => {
  const processedBuilds = await processPlatform<OutputFile>({
    process: 'format',
    ...options,
  });

  return processedBuilds;
};

export const formatTheme = async (themeConfig: Theme) => {
  const { tokenSets } = await createTokens(themeConfig);

  const $themes = await generate$Themes(['dark', 'light'], [themeConfig.name], themeConfig.colors);
  const processedBuilds = await formatTokens({
    tokenSets,
    $themes,
    verbose: false,
    preview: false,
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
export const formatThemeCSS = async (themeConfig: Theme) => {
  const processedBuilds = await formatTheme(themeConfig);
  const themeCSSFiles = createThemeCSSFiles({ processedBuilds });
  return R.head(themeCSSFiles)?.output ?? '';
};
