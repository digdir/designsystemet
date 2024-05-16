import fs from 'fs';

import * as R from 'ramda';
import type { AcceptedPlugin, Plugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

type CSSCodemodProps = {
  dictionary: Record<string, string>;
  globPath?: string;
};

export const cssVarCodemod = ({ dictionary, globPath = './**/*.css' }: CSSCodemodProps) => {
  const transformPlugin: Plugin = {
    postcssPlugin: 'Replaces referenced CSS variables',
    Declaration(decl) {
      Object.keys(dictionary).forEach((key) => {
        const newValue = dictionary[key];

        if (R.isEmpty(newValue)) {
          // console.log(`Skipping "${key}"; missing new value`);
        }

        if (newValue === '[delete]') {
          // console.log(`Found delete token "${key}"`);
        }

        if (decl.value.includes(key) && !R.isEmpty(newValue)) {
          decl.value = decl.value.replace(key, newValue);
        }
      });
    },
  };

  const plugins: AcceptedPlugin[] = [transformPlugin];

  const processor = postcss(plugins);

  const transform = async () => {
    const files = await glob(globPath, { ignore: ['node_modules/**'] });

    const filePromises = files.map(async (file) => {
      const contents = fs.readFileSync(file).toString();
      const result = await processor.process(contents, { from: undefined });

      fs.writeFileSync(file, result.css);
    });

    await Promise.all(filePromises);
  };

  // Run the transform.
  void transform();
};
