/// <reference types="vitest" />

import { resolve } from 'node:path';
import { defineProject } from 'vitest/config';
import baseConfig from '../../packages/react/vitest.config.mjs';
import * as pkgJson from './package.json';

const reactRoot = resolve(import.meta.dirname, '../../packages/react');
const react18 = resolve(import.meta.dirname, 'node_modules');

const shouldBeAliased = Object.keys({
  ...pkgJson.dependencies,
  ...pkgJson.devDependencies,
});

export default defineProject({
  ...baseConfig,
  resolve: {
    alias: Object.fromEntries(
      shouldBeAliased.map((pkg) => [pkg, `${react18}/${pkg}`]),
    ),
  },
  cacheDir: 'node_modules/.vite/react-18',
  esbuild: {
    ...baseConfig.esbuild,
  },
  test: {
    ...baseConfig.test,
    env: {
      ...baseConfig.test.env,
      VITE_REACT_VERSION: '18',
    },
    root: reactRoot,
  },
});
