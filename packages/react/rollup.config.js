import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import svgr from '@svgr/rollup';

// css files needs to be bundled
const altinnFigmaTokensExceptCss = /@altinn\/figma-design-tokens.*(?<!css)$/;

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
      altinnFigmaTokensExceptCss,
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
      json(),
      svgr({ exportType: 'named' }),
      postcss(),
      image(),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: {
      file: './dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts.default()],
    external: [/@altinn\/figma-design-tokens/, /\.css$/],
  },
];
