/*
The popular `rollup-terser-plugin` does not work well with Yarn PnP; its
reliance on `jest-worker` makes the build hang — probably related to
https://github.com/facebook/jest/issues/12060. This file provides a
simpler plugin that invokes Terser without Jest workers.
*/

import { minify } from 'terser';

function terser(terserOptions = {}) {
  return {
    name: 'terser',

    async renderChunk(code, _chunk, outputOptions) {
      const defaultOptions = {
        sourceMap: !!outputOptions.sourcemap,
      };

      // eslint-disable-next-line default-case
      switch (outputOptions.format) {
        case 'es':
        case 'esm':
          defaultOptions.module = true;
          break;
        case 'cjs':
          defaultOptions.toplevel = true;
          break;
      }

      const effectiveTerserOptions = { ...defaultOptions, ...terserOptions };
      return await minify(code, effectiveTerserOptions);
    },
  };
}

export default terser;
