import fs from 'fs';

import * as R from 'ramda';
import type { AcceptedPlugin, Plugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

type CSSCodemodProps = {
  dictionary: Record<string, string>;
  globPattern?: string;
};

export const cssVarCodemod = async ({ dictionary, globPattern = './**/*.css' }: CSSCodemodProps) => {
  const transformPlugin: Plugin = {
    postcssPlugin: 'Replaces referenced CSS variables',
    Declaration(decl) {
      const value = decl.value;

      Object.entries(dictionary).forEach(([from, to]) => {
        if (R.isEmpty(to)) {
          // console.log(chalk.yellow(`Skipping "${from}"; missing to value`));
        }

        if (to === '[delete]') {
          // console.log(`Found delete tag for "${to}"`);
        }

        if (R.includes(from, value) && !R.isEmpty(to)) {
          decl.value = value.replace(from, to);
        }
      });
    },
  };

  const plugins: AcceptedPlugin[] = [transformPlugin];

  const processor = postcss(plugins);

  const transform = async () => {
    const files = await glob(globPattern, { ignore: ['node_modules/**', 'dist/**'] });

    const filePromises = files.map(async (file) => {
      const contents = fs.readFileSync(file).toString();
      const result = await processor.process(contents, { from: undefined });

      fs.writeFileSync(file, result.css);
    });

    await Promise.all(filePromises);
  };

  // Run the transform.
  return transform();
};
