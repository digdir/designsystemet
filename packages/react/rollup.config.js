import fs from 'node:fs';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';

// These are dependencies, but are not in our package.json
const implicitDependencies = [
  '@digdir/designsystemet-theme',
  '@digdir/designsystemet-css',
  '@digdir/design-system-tokens',
];

const dependencies = Object.keys({
  ...implicitDependencies,
  ...pkg.dependencies,
  ...pkg.peerDependencies,
});

/*
Regexes to correctly mark submodules from dependencies as being external
*/
const dependenciesSubmodules = dependencies.map(
  (dep) => new RegExp(`^${dep}/`),
);

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
    external: [...dependencies, ...dependenciesSubmodules],
    plugins: [
      resolve(),
      commonjs(),
      copy({
        targets: [
          {
            src: './tsc-build/**/*.d.ts*',
            dest: './dist',
          },
        ],
        flatten: false,
      }),
      moveFiles('./dist/tsc-build', './dist/types'),
      copy({
        targets: [{ src: './react-types.d.ts', dest: './dist' }],
      }),
    ],
  },
];

function moveFiles(from, to) {
  return {
    name: 'move-files',
    generateBundle() {
      const log = (msg) => console.log('\x1b[36m%s\x1b[0m', msg);
      if (fs.existsSync(from)) {
        log(`move: ${from} → ${to}`);
        fs.renameSync(from, to);
      }
    },
  };
}
