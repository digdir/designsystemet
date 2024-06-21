import fs from 'fs-extra';
import glob from 'fast-glob';
import type { Action } from 'style-dictionary/types';
import chalk from 'chalk';
import * as R from 'ramda';

const sortLightmodeFirst = R.sortWith([R.descend(R.includes('light')), R.descend(R.includes('secondary'))]);

/**
 * Creates a CSS entry file that imports base CSS files for a theme
 */
export const makeEntryFile: Action = {
  name: 'make_entryfile',
  do: async function (dictionary, platform) {
    const { outPath, theme, log } = platform;

    const writePath = `${outPath}/${theme}.css`;

    if (log?.verbosity !== 'silent') {
      console.log(chalk.green(`Creating entry file: ${writePath}`));
    }

    const generateImportUrls = R.pipe(
      sortLightmodeFirst,
      R.map((file): string => `@import url('./${theme}/${file.toString()}');`),
      R.join('\n'),
    );

    const files = await glob(`**/*`, { cwd: platform.buildPath });
    const content = generateImportUrls(files);

    await fs.writeFile(writePath, content);
  },
  undo: async function noOp() {},
};
