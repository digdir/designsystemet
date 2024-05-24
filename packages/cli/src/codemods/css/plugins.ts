import * as R from 'ramda';
import type { Plugin } from 'postcss';
import chalk from 'chalk';

type PluginGenerator = (dictionary: Record<string, string>) => Plugin;

export const cssClassRename: PluginGenerator = (dictionary) => ({
  postcssPlugin: 'Renames CSS classes',
  Rule(decl) {
    const selector = decl.selector;

    if (!selector) return;

    Object.entries(dictionary).forEach(([from, to]) => {
      if (!selector.includes(from)) return;

      const newSelector = selector.replace(new RegExp(from, 'g'), to);

      decl.selector = newSelector;
    });
  },
});

export const cssVarRename: PluginGenerator = (dictionary) => ({
  postcssPlugin: 'Replaces referenced CSS variables',
  Declaration(decl) {
    const value = decl.value;

    Object.entries(dictionary).forEach(([from, to]) => {
      if (R.isEmpty(to)) {
        // console.log(chalk.yellow(`Skipping "${from}"; missing to value`));
      }

      if (R.includes(from, value) && !R.isEmpty(to)) {
        if (to === '[delete]') {
          console.log(`${chalk.red('Deleted declaration:')} ${value}`);
        }

        decl.value = value.replace(from, to);
      }
    });
  },
});
