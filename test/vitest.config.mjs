/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      '{packages,figma,test}/*/vitest.config.mjs',
      'apps/themebuilder/vitest.config.ts',
    ],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
