import { glob } from 'node:fs/promises';
import path from 'node:path';
import type { AcceptedPlugin } from 'postcss';
import postcss from 'postcss';
import { dsfs } from '../../../../src/utils/filesystem.ts';

type CssCodemodProps = {
  plugins: AcceptedPlugin[];
  globPattern?: string;
};

export const runCssCodemod = async ({ plugins = [], globPattern = './**/*.css' }: CssCodemodProps) => {
  const processor = postcss(plugins);

  const transform = async () => {
    console.log(`Running migration in ${globPattern}`);
    /* Note: `fs.glob` is experimental before Node 22.17.0 and emits an ExperimentalWarning on older 22.x versions */
    const files: string[] = [];
    for await (const file of glob(globPattern, {
      exclude: (file) => file.includes('node_modules') || file.includes('dist'),
    })) {
      files.push(path.resolve(file));
    }

    const filePromises = files.map(async (file) => {
      const contents = await dsfs.readFile(file);
      const result = await processor.process(contents.toString(), { from: file });

      await dsfs.writeFile(file, result.css);
    });

    await Promise.all(filePromises);
  };

  // Run the transform.
  return transform();
};
