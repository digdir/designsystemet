import fs from 'fs';

import type { AcceptedPlugin, Plugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

export const cssVarCodemod = (dictionary: Record<string, string>) => {
  const transformPlugin: Plugin = {
    postcssPlugin: 'Replace',
    Declaration(declaration) {
      Object.keys(dictionary).forEach((key) => {
        if (declaration.value.includes(key)) {
          declaration.value = declaration.value.replace(key, dictionary[key]);
        }
      });
    },
  };

  const plugins: AcceptedPlugin[] = [transformPlugin];

  const processor = postcss(plugins);

  const transform = async () => {
    const files = glob.sync('./**/*.css');

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
