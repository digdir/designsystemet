import fs from 'fs-extra';
import glob from 'fast-glob';
import type { Action } from 'style-dictionary/types';
import chalk from 'chalk';
import * as R from 'ramda';

export const makeEntryFile: Action = {
  name: 'make_entryfile',
  do: async function (dictionary, platform) {
    const { outPath, theme, log } = platform;

    const writePath = `${outPath}/${theme}.css`;

    if (log?.verbosity !== 'silent') {
      console.log(chalk.green(`Creating entry file: ${writePath}`));
    }

    const files = await glob(`**/*`, { cwd: platform.buildPath });
    const content = R.reverse(R.sortBy(R.includes('light'), files))
      .map((file) => `@import url('./${theme}/${file}');`)
      .join('\n');

    await fs.writeFile(writePath, content);
  },
  undo: async function noOp() {},
};
