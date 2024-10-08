/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/vitest.setup.ts'],
    reporters: [
      'default',
      ['junit', { suiteName: 'Unit tests', addFileAttribute: true }],
    ],
    outputFile: {
      junit: './test-report.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['html', 'json-summary', 'json'],
      reportOnFailure: true,
      include: ['packages/react/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.{stories,e2e,docs,test}.{ts,tsx}',
        '**/index.ts',
        '**/types/**',
      ],
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
