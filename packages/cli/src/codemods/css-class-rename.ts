import fs from 'fs';

import type { AcceptedPlugin, Plugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

type CSSCodemodProps = {
  dictionary: {
    from: string;
    to: string;
  };
  globPath?: string;
};

export const cssNameCodemod = ({
  dictionary,
  globPath = './**/*.css',
}: CSSCodemodProps) => {
  const transformPlugin: Plugin = {
    postcssPlugin: 'Renames CSS classes',
    Rule(decl) {
      if (!decl.selector) return;
      if (!decl.selector.includes(dictionary.from)) return;

      const newSelector = decl.selector.replace(
        new RegExp(dictionary.from, 'g'),
        dictionary.to,
      );

      decl.selector = newSelector;
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

console.log('running cssNameCodemod');

void cssNameCodemod({
  dictionary: {
    from: '.fds-',
    to: '.ds-',
  },
  globPath: './**/*.css',
});
