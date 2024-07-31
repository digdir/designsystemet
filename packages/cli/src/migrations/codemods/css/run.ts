import fs from 'fs';

import glob from 'fast-glob';
import type { AcceptedPlugin } from 'postcss';
import postcss from 'postcss';

type CssCodemodProps = {
  plugins: AcceptedPlugin[];
  globPattern?: string;
};

export const runCssCodemod = async ({ plugins = [], globPattern = './**/*.css' }: CssCodemodProps) => {
  const processor = postcss(plugins);

  const transform = async () => {
    const files = await glob(globPattern, { ignore: ['node_modules/**', 'dist/**'] });

    const filePromises = files.map(async (file) => {
      const contents = fs.readFileSync(file).toString();
      const result = await processor.process(contents, { from: file });

      fs.writeFileSync(file, result.css);
    });

    await Promise.all(filePromises);
  };

  // Run the transform.
  return transform();
};
