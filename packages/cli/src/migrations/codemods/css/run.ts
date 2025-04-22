import fs from 'node:fs';

import glob from 'fast-glob';
import type { AcceptedPlugin } from 'postcss';
import postcss from 'postcss';
import { readFile } from '../../../utils.js';

type CssCodemodProps = {
  plugins: AcceptedPlugin[];
  globPattern?: string;
};

export const runCssCodemod = async ({ plugins = [], globPattern = './**/*.css' }: CssCodemodProps) => {
  const processor = postcss(plugins);

  const transform = async () => {
    console.log(`Running migration in ${globPattern}`);
    const files = await glob([globPattern], {
      ignore: ['**/node_modules/**', '**/dist/**'], // TODO: Not working as expected
      absolute: true,
    });

    const filePromises = files.map(async (file) => {
      if (file.includes('node_modules') || file.includes('dist')) {
        // console.log(`Skipping ${file}`);
        return;
      }
      const contents = readFile(file).toString();
      const result = await processor.process(contents, { from: file });

      fs.writeFileSync(file, result.css);
    });

    await Promise.all(filePromises);
  };

  // Run the transform.
  return transform();
};
