import fs from 'fs';

import type { AcceptedPlugin, Plugin } from 'postcss';
import postcss from 'postcss';
import glob from 'fast-glob';

export const cssVarCodemod = (tokens: Record<string, string>) => {
  const transformPlugin: Plugin = {
    postcssPlugin: 'Dark/Light tokens to Strong/Subtle tokens',
    Declaration(decl) {
      Object.keys(tokens).forEach((key) => {
        if (decl.value.includes(key)) {
          decl.value = decl.value.replace(key, tokens[key]);
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
