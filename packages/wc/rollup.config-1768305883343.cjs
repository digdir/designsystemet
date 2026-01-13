'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('node:fs');
var commonjs = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');
var copy = require('rollup-plugin-copy');
var pkg = require('./package.json');

// These are dependencies, but are not in our package.json
const implicitDependencies = [
  '@digdir/designsystemet-css',
  '@digdir/design-system-tokens',
];

const dependencies = Object.keys({
  ...implicitDependencies,
  ...pkg.dependencies,
  ...pkg.peerDependencies,
}).filter((dep) => dep !== '@floating-ui/dom'); // Bundle floating-ui

const dependenciesSubmodules = dependencies.map(
  (dep) => new RegExp(`^${dep}/`),
);

var rollup_config = [
  {
    input: {
      index: './tsc-build/index.js',
      'components/field/field': './tsc-build/components/field/field.js',
      'components/popover/popover': './tsc-build/components/popover/popover.js',
    },
    output: [
      {
        dir: './dist/cjs',
        format: 'cjs',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        inlineDynamicImports: false,
      },
      {
        dir: './dist/esm',
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        inlineDynamicImports: false,
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

exports.default = rollup_config;
