import fs from 'fs';

import type { AcceptedPlugin, Plugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

type CSSCodemodProps = {
  dictionary: Record<string, string>;
  globPath?: string;
};

export const cssVarCodemod = ({ dictionary, globPath = './**/*.css' }: CSSCodemodProps) => {
  const transformPlugin: Plugin = {
    postcssPlugin: 'Replace CSS variables',
    Declaration(decl) {
      Object.keys(dictionary).forEach((key) => {
        if (decl.value.includes(key)) {
          decl.value = decl.value.replace(key, dictionary[key]);
        }
      });
    },
  };

  const plugins: AcceptedPlugin[] = [transformPlugin];

  const processor = postcss(plugins);

  const transform = async () => {
    const files = glob.sync(globPath);

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
