import path from 'node:path';
import chalk from 'chalk';
import glob from 'fast-glob';
import fs from 'fs-extra';
import * as R from 'ramda';

const sortLightmodeFirst = R.sortWith<string>([R.descend(R.includes('light')), R.descend(R.includes('secondary'))]);

const header = `@charset "UTF-8";

@layer ds.reset, ds.theme, ds.base, ds.utilities, ds.components;
\n`;

const sortAndConcat = R.pipe(
  sortLightmodeFirst,
  R.map((file): string => {
    try {
      const content = fs.readFileSync(file, 'utf-8').toString();
      return content;
    } catch (e) {
      console.error(`Error reading file: ${file}`);
      return '';
    }
  }),
  R.join('\n'),
);

type EntryFile = (options: {
  outPath: string;
  buildPath: string;
  theme: string;
}) => Promise<undefined>;

/**
 * Creates a CSS entry file that imports base CSS files for a theme
 */
export const makeEntryFile: EntryFile = async ({ outPath, buildPath, theme }) => {
  const writePath = `${outPath}/${theme}.css`;

  const files = await glob(`**/*`, { cwd: buildPath });
  const content = header + sortAndConcat(files.map((file) => `${buildPath}/${file}`));

  await fs.writeFile(writePath, content);
};
