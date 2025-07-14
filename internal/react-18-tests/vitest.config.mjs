/// <reference types="vitest" />

import { resolve } from 'node:path';
import { defineProject } from 'vitest/config';
import baseConfig from '../../packages/react/vitest.config.mjs';

const reactRoot = resolve(import.meta.dirname, '../../packages/react');
const react18 = resolve(import.meta.dirname, 'node_modules');

const shouldBeAliased = [
  '@floating-ui/react',
  '@navikt/aksel-icons',
  '@radix-ui/react-slot',
  '@tanstack/react-virtual',
  '@testing-library/react',
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react/package.json',
  'react-dom',
  'react-dom/client',
  'react-dom/server',
  'react-dom/server.browser',
  'react-dom/server.node',
  'react-dom/profiling',
  'react-dom/test-utils',
  'react-dom/package.json',
];

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
    root: reactRoot,
  },
});
