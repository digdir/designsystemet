/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { browserslistToTargets } from 'lightningcss';

import pkg from './package.json';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/vitest.setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },

  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(pkg.browserslist),
    },
  },
  build: {
    cssMinify: 'lightningcss',
  },
});
