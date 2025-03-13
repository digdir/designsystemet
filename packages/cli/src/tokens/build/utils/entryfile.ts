import chalk from 'chalk';
import glob from 'fast-glob';
import fs from 'fs-extra';
import * as R from 'ramda';
import { writeFile } from '../../../utils.js';

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

const sortByDefinedOrder = R.sortBy<string>((fileName) => {
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
    console.log();

    return Infinity;
  }
  return sortIndex;
});

const header = `@charset "UTF-8";

@layer ds.reset, ds.theme, ds.base, ds.utilities, ds.components;
\n`;

const sortAlphabetically = R.sort<string>(R.ascend((x) => x));

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

type ConcatFiles = (options: {
  outPath: string;
  buildPath: string;
  theme: string;
  dry?: boolean;
}) => Promise<void>;

/**
 * Concat all CSS files in the buildPath into a single CSS file in the outPath
 */
export const concatFiles: ConcatFiles = async ({ outPath, buildPath, theme, dry }) => {
  const writePath = `${outPath}/${theme}.css`;

  const files = await glob(`**/*`, { cwd: buildPath });
  const sortedFiles = R.pipe(sortAlphabetically, sortByDefinedOrder)(files);
  const content = header + concat(sortedFiles.map((file) => `${buildPath}/${file}`));

  await writeFile(writePath, content, dry);
};
