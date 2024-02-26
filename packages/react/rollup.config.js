import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cssnano from 'cssnano';

import { generateScopedName } from './scripts/name';

export default [
  {
    input: './tsc-build/index.js',
    output: [
      {
        dir: './dist/cjs',
        format: 'cjs',
        banner: "'use client';",
        // preserveModules: true,
        // preserveModulesRoot: 'tsc-build',
      },
      {
        dir: './dist/esm',
        format: 'es',
        banner: "'use client';",
        // preserveModules: true,
        // preserveModulesRoot: 'tsc-build',
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      postcss({
        // disabled until our css package is released and people are informed of new setup
        // extract: true,
        modules: {
          generateScopedName,
        },
        plugins: [cssnano({ preset: 'default' })],
      }),
    ],
  },
];
