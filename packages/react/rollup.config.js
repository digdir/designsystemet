import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import { generateScopedName } from './scripts/name';

export default [
  {
    input: './tsc-build/index.js',
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
      /@digdir\/designsystemet-theme/,
      /@digdir\/designsystemet-css/,
      /@digdir\/design-system-tokens/,
      /@navikt\/aksel-icons/,
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      postcss({
        // extract name is used in script in package.json
        extract: 'react-css-modules.css',
        modules: {
          generateScopedName,
        },
      }),
    ],
  },
];
