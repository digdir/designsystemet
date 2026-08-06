import { generate$Themes } from './create/generators/$themes.ts';
import { createTokens, tokenSetDimensions } from './create.ts';
import { createTailwindCSSFiles } from './process/output/tailwind.ts';
import { createThemeCSSFiles } from './process/output/theme.ts';
import { type FormatOptions, processPlatform } from './process/platform.ts';
import { processThemeObject } from './process/utils/getMultidimensionalThemes.ts';
import type { OutputFile, Theme } from './types.ts';
import { toColorNames } from './utils.ts';

type FormatTokensOptions = Omit<FormatOptions, 'type' | 'buildTokenFormats'>;

export const formatTokens = async (options: FormatTokensOptions) => {
  const processedBuilds = await processPlatform({
    type: 'format',
    buildTokenFormats: {},
    ...options,
  });

  return processedBuilds;
};

export const formatTheme = async (themeConfig: Theme, options: Pick<FormatTokensOptions, 'verbose' | 'tailwind'>) => {
  const themeNames = [themeConfig.name];
  const colorNames = toColorNames(themeConfig.colors);

  const { tokenSets } = await createTokens(themeConfig);
  const $themes = await generate$Themes(tokenSetDimensions, themeNames, colorNames);

  const processed$themes = $themes.map(processThemeObject);

  const processedBuilds = await formatTokens({
    ...options,
    tokenSets,
    processed$themes,
  });

  return processedBuilds;
};

/**
 * Formats a theme configuration into CSS strings. This function processes the provided `Theme` configuration, generates the necessary token sets, and creates CSS files based on the processed builds. If the `tailwind` option is enabled, it also generates Tailwind CSS files.
 *
 * This function takes a `Theme` configuration object, processes it using the
 * `formatTheme` function, and then generates CSS using the `createThemeCSS` function.
 *
 * @param themeConfig - The theme configuration object to be formatted.
 * @param options - Options for formatting, including verbosity and Tailwind CSS generation.
 * @returns A promise that resolves to an array of `OutputFile` objects containing the formatted CSS files.
 */
export const formatThemeCSS = async (
  themeConfig: Theme,
  options: Pick<FormatTokensOptions, 'verbose' | 'tailwind'>,
) => {
  const processedBuilds = await formatTheme(themeConfig, options);
  let files: OutputFile[] = createThemeCSSFiles({ processedBuilds });

  if (options.tailwind) {
    const tailwindFiles = createTailwindCSSFiles(files);
    files = files.concat(tailwindFiles.filter(Boolean) as OutputFile[]);
  }

  return files;
};
