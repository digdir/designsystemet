import fs from 'fs-extra';
import glob from 'fast-glob';
import type { Action } from 'style-dictionary/types';
import chalk from 'chalk';
import * as R from 'ramda';

export const makeEntryFile: Action = {
  name: 'make_entryfile',
  do: async function (dictionary, config) {
    console.log(chalk.green('Creating entry file'));
    const { outPath, folderName } = config;
    const files = await glob(`**/*`, { cwd: config.buildPath });
    const content = R.reverse(R.sortBy(R.includes('light'), files))
      .map((file) => `@import url('./${folderName}/${file}');`)
      .join('\n');
    await fs.writeFile(`${outPath}/${folderName}.css`, content);
  },
  undo: async function noOp() {},
};
