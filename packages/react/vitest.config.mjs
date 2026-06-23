import { resolve } from 'node:path';
import { playwright } from '@vitest/browser-playwright';
/// <reference types="vitest" />
import { defineProject } from 'vitest/config';

export default defineProject({
  esbuild: {
    // esbuild does not follow `extends`, so we need to specify the jsx and target options here as well
    // https://esbuild.github.io/api/#tsconfig
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        target: 'es2022',
      },
    },
  },
  test: {
    env: {
      VITE_REACT_VERSION: '19',
    },
    typecheck: {
      tsconfig: resolve(import.meta.dirname, 'tsconfig.tests.json'),
    },
    globals: true,
    setupFiles: ['../../test/vitest.setup.ts', './vitest.setup.ts'].map(
      (path) => resolve(import.meta.dirname, path),
    ),
    browser: {
      enabled: true,
      instances: [{ browser: 'chromium' }],
      viewport: { width: 1280, height: 720 }, // Ensure desktop size viewport for consistent test results
      provider: playwright(),
      headless: true,
    },
  },
});
