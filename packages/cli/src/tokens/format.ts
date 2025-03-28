import { createTokens } from './create.js';
import { type FormatOptions, processPlatform } from './process/platform.js';
import type { Theme } from './types.js';
import { generateThemesJson } from './write/generate$themes.js';

export type FormattedToken = {
  output: string;
  destination: string | undefined;
};

export const formatTokens = async (options: Omit<FormatOptions, 'process'>) => {
  const tokens = await processPlatform<FormattedToken>({
    process: 'format',
    ...options,
  });

  return tokens;
};

export const formatTheme = async (themeConfig: Theme) => {
  const { tokenSets } = await createTokens(themeConfig);

  const $themes = generateThemesJson(['dark', 'light'], [themeConfig.name], themeConfig.colors);
  const tokens = await formatTokens({
    tokenSets,
    $themes,
    verbose: false,
    preview: false,
  });

  return tokens;
};
