import * as R from 'ramda';
import type { Plugin, Declaration } from 'postcss';
import chalk from 'chalk';
import hash from 'object-hash';

type PluginGenerator = (dictionary: Record<string, string>) => Plugin;

const printDelete = (text: string) => console.log(`${chalk.red('Deleted:')} ${text}`.replace(/"|'/g, ''));

const deleteMsg = (decl: Declaration, from: string) =>
  `${chalk.yellow(from)} @ ${chalk.gray(`${JSON.stringify(decl.source?.input.file)}:${decl.source?.start?.line}:${decl.source?.start?.column}`)}`;

export const cssClassRename: PluginGenerator = (dictionary) => ({
  postcssPlugin: `Renames CSS classes ${hash(dictionary)}`,
  Rule(rule) {
    const selector = rule.selector;

    if (!selector) return;

    Object.entries(dictionary).forEach(([from, to]) => {
      if (!selector.includes(from)) return;

      const newSelector = selector.replace(new RegExp(from, 'g'), to);

      rule.selector = newSelector;
    });
  },
});

export const cssVarRename: PluginGenerator = (dictionary) => ({
  postcssPlugin: `Replaces CSS variables ${hash(dictionary)}`,
  Declaration(decl) {
    const { value, prop } = decl;

    const deleted = new Set<string>();

    Object.entries(dictionary).forEach(([from, to]) => {
      if (!R.isEmpty(to)) {
        switch (true) {
          case R.includes(from, value):
            to === '[delete]' && deleted.add(deleteMsg(decl, from));
            decl.value = value.replace(from, to);
            break;

          case R.includes(from, prop):
            to === '[delete]' && deleted.add(deleteMsg(decl, from));
            decl.value = prop.replace(from, to);
            break;
        }
      }
    });

    if (deleted.size > 0) {
      Array.from(deleted).forEach(printDelete);
    }
  },
});
