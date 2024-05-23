import fs from 'fs';

import type { AcceptedPlugin, Plugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

type CSSCodemodProps = {
  dictionary: Record<string, string>;
  globPattern?: string;
};

export const cssNameCodemod = async ({ dictionary, globPattern = './**/*.css' }: CSSCodemodProps) => {
  const transformPlugin: Plugin = {
    postcssPlugin: 'Renames CSS classes',
    Rule(decl) {
      Object.entries(dictionary).forEach(([from, to]) => {
        if (!decl.selector) return;
        if (!decl.selector.includes(from)) return;

        const newSelector = decl.selector.replace(new RegExp(from, 'g'), to);

        decl.selector = newSelector;
      });
    },
  };

  const plugins: AcceptedPlugin[] = [transformPlugin];

  const processor = postcss(plugins);

  const transform = async () => {
    const files = await glob(globPattern, { ignore: ['node_modules/**'] });

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
