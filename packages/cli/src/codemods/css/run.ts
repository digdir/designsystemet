import fs from 'fs';

import type { AcceptedPlugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

type CssCodemodProps = {
  plugins: AcceptedPlugin[];
  globPattern?: string;
};

export const runCssCodemod = async ({ plugins = [], globPattern = './**/*.css' }: CssCodemodProps) => {
  const processor = postcss(plugins);

  const transform = async () => {
    const files = await glob(globPattern, { ignore: ['node_modules/**', 'dist/**'] });
    console.log(files, plugins.length);
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
