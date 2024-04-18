'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var resolve = require('@rollup/plugin-node-resolve');
var commonjs = require('@rollup/plugin-commonjs');
var postcss = require('rollup-plugin-postcss');
var peerDepsExternal = require('rollup-plugin-peer-deps-external');
var cssnano = require('cssnano');
var path = require('path');

function hashCode(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash + 2147483648).toString(16);
}

/**
 *  @url https://github.com/madyankin/postcss-modules#generating-scoped-names
 * @param {string} name
 * @param {string} fileNames
 * @returns
 */
function generateScopedName(name, fileNames) {
  const componentName = path.basename(fileNames, '.module.css').toLowerCase();
  const hash = hashCode(fileNames);

  return `fds-legacy-${componentName}-${name}-${hash}`;
}

var rollup_config = [
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
    external: [
      /@digdir\/designsystemet-react/,
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

exports.default = rollup_config;
