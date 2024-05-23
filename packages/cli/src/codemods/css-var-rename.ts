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
      Object.keys(dictionary).forEach((from) => {
        const to = dictionary[from];

        if (R.isEmpty(to)) {
          //console.log(`Skipping "${key}"; missing new value`);
        }

        if (to === '[delete]') {
          //console.log(`Found delete token "${key}"`);
        }

        if (decl.value.includes(from) && !R.isEmpty(to)) {
          decl.value = decl.value.replace(from, to);
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
