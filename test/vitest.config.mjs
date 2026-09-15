/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['{packages,internal}/*/vitest.config.mjs'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
