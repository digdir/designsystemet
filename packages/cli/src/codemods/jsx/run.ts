import glob from 'fast-glob';
import { run as jscodeshift } from 'jscodeshift/src/Runner.js';
import type { Options } from 'jscodeshift';
import chalk from 'chalk';

type CssCodemodProps = {
  globPattern?: string;
  dry?: boolean;
};

const transformer = `${import.meta.dirname}/classname-prefix.ts`;

export const runJSXCodemod = async ({ globPattern = './**/*.tsx', dry }: CssCodemodProps) => {
  const options: Options = {
    dry,
    extensions: 'tsx',
    parser: 'tsx',
  };
  const transform = async () => {
    const files = await glob(globPattern, { ignore: ['node_modules/**', 'dist/**'] });

    const result = await jscodeshift(transformer, files, options);

    if (result.ok) {
      console.log(chalk.green('Finished parsing'));
    }
  };

  return transform();
};
