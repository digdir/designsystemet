import glob from 'fast-glob';
import type { AcceptedPlugin } from 'postcss';
import postcss from 'postcss';
import fs from '../../../../src/utils/filesystem.js';

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
      const contents = await fs.readFile(file);
      const result = await processor.process(contents.toString(), { from: file });

      await fs.writeFile(file, result.css);
    });

    await Promise.all(filePromises);
  };

  // Run the transform.
  return transform();
};
