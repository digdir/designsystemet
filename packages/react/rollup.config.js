import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import svgr from '@svgr/rollup';
import cssnano from 'cssnano';

import { generateScopedName } from './scripts/rollup/hash-name';

const input = './tsc-build/index.js';
const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  json(),
  svgr({ exportType: 'named' }),
  postcss({
    extract: true,
    modules: {
      generateScopedName,
    },
    plugins: [cssnano({ preset: 'default' })],
  }),
  image(),
];

export default [
  {
    input,
    output: [
      {
        dir: './dist/cjs',
        format: 'cjs',
        banner: "'use client';",
        preserveModules: true,
        preserveModulesRoot: 'tsc-build',
      },
      {
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
    plugins,
  },
];
