import path from 'node:path';
import chalk from 'chalk';
import glob from 'fast-glob';
import fs from 'fs-extra';
import * as R from 'ramda';

/**
 * Defines a sort order for the sections of the entry CSS file.
 * This ensures a deterministic order, whereas earlier this was nondeterministic
 */
// biome-ignore format: keep array as one line per item
const sortOrder = [
  'color-mode/light',
  'typography/secondary',
  'semantic',
  'color-mode/dark',
  'color-mode/contrast',
  'typography/primary',
];

const sortByDefinedOrder = R.sortBy<string>((fileName) => {
  const sortIndex = sortOrder.findIndex((sortElement) => fileName.includes(`${sortElement}.css`));
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
    console.log();

    return Infinity;
  }
  return sortIndex;
});

const header = `@charset "UTF-8";

@layer ds.reset, ds.theme, ds.base, ds.utilities, ds.components;
\n`;

const concat = R.pipe(
  R.map((file: string): string => {
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
  const sortedFileNames = sortByDefinedOrder(files);
  const content = header + concat(sortedFileNames.map((file) => `${buildPath}/${file}`));

  await fs.writeFile(writePath, content);
};
