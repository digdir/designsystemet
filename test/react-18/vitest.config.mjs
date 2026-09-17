/// <reference types="vitest" />

import { resolve } from 'node:path';
import { defineProject } from 'vitest/config';
import baseConfig from '../../packages/react/vitest.config.mjs';
import pkgJson from './package.json' with { type: 'json' };

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
  // Keep the Vite cache next to this package's own node_modules, where the aliases point
  cacheDir: resolve(import.meta.dirname, 'node_modules/.vite'),
  test: {
    ...baseConfig.test,
    name: 'react-18',
    env: {
      ...baseConfig.test.env,
      VITE_REACT_VERSION: '18',
    },
    root: reactRoot,
  },
});
