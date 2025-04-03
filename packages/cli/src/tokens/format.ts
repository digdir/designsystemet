import * as R from 'ramda';

import chalk from 'chalk';
import { createTokens } from './create.js';
import { generate$Themes } from './create/generators/$themes.js';
import { type FormatOptions, type ProcessReturn, processPlatform } from './process/platform.js';
import type { Theme } from './types.js';

export type File = {
  output: string;
  destination: string | undefined;
};

export const formatTokens = async (options: Omit<FormatOptions, 'process'>) => {
  const processedBuilds = await processPlatform<File>({
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
  const themeCSSFiles = createThemeCSSFiles(processedBuilds);
  return R.head(themeCSSFiles)?.output ?? '';
};

export const createThemeCSSFiles = (processedBuilds: ProcessReturn) => {
  const groupedByTheme: Record<string, File[]> = {};

  for (const [_, buildResults] of Object.entries(R.dissoc('types', processedBuilds))) {
    for (const buildResult of buildResults) {
      const previous = groupedByTheme[buildResult.permutation.theme] ?? [];
      groupedByTheme[buildResult.permutation.theme] = R.concat(previous, buildResult.formatted);
    }
  }

  /**
   * Defines a sort order for the sections of the entry CSS file.
   * This ensures a deterministic order, whereas earlier this was nondeterministic
   */
  // biome-ignore format: keep array as one line per item
  const sortOrder = [
  'color-scheme/light',
  'typography/secondary',
  'semantic',
  'color-scheme/dark',
  'color-scheme/contrast',
  'typography/primary',
  'color/',
];

  const sortByDefinedOrder = R.sortBy<File>((file) => {
    const fileName = file.destination || '';
    const sortIndex = sortOrder.findIndex((sortElement) => {
      if (sortElement.endsWith('/')) {
        return fileName.includes(sortElement);
      }
      return fileName.includes(`${sortElement}.css`);
    });
    if (sortIndex === -1) {
      // Ensure file names that don't have a specified sort order appear last
      console.error(
        chalk.yellow('WARNING: CSS section does not have a defined sort order:', fileName.replace('.css', '')),
      );
      console.log(
        chalk.dim(
          `
A Digdir developer should define its order in the sortOrder array in entryfile.ts.
The section will currently be added to the end of the entry file, but the exact
order may change due to nondeterminism.`.trim(),
        ),
      );

      return Infinity;
    }
    return sortIndex;
  });

  const header = `@charset "UTF-8";

@layer ds.reset, ds.theme, ds.base, ds.utilities, ds.components;
\n`;

  const sortAlphabetically = R.sort<File>(R.ascend((x) => x.destination || ''));
  const pickOutputs = R.map<File, string>(R.view(R.lensProp('output')));

  const themeCSSFile = R.pipe(
    sortAlphabetically,
    sortByDefinedOrder,
    pickOutputs,
    R.join('\n'),
    (content) => header + content,
  );

  const themeCSSFiles: File[] = Object.entries(groupedByTheme).map(([theme, files]) => ({
    destination: `${theme}.css`,
    output: themeCSSFile(files),
  }));

  return themeCSSFiles;
};
