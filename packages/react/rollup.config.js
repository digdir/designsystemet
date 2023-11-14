import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cssnano from 'cssnano';

import { generateScopedName } from './scripts/name';

const input = './tsc-build/index.js';

export default [
  {
    input,
    output: [
      {
        input,
        dir: './dist/cjs',
        format: 'cjs',
        banner: "'use client';",
        preserveModules: true,
        preserveModulesRoot: 'tsc-build',
      },
      {
        input,
        dir: './dist/esm',
        format: 'es',
        banner: "'use client';",
        preserveModules: true,
        preserveModulesRoot: 'tsc-build',
      },
    ],
    external: [
      /@altinn\/figma-design-tokens.*(?<!css)$/,
      /@react-hookz\/web/,
      /@radix-ui\/react-popover$/,
      /react-number-format/,
      /react-leaflet/,
      /leaflet/,
      /@navikt\/ds-icons/,
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      postcss(
        // This is to make sure names match those in built css files
        {
          // extract: true,
          modules: {
            generateScopedName,
          },
          plugins: [cssnano({ preset: 'default' })],
        },
      ),
    ],
  },
];
