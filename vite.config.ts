import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env': {} },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  test: {
    projects: ['packages/*/vitest.config.mjs'],
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
  // Temporary "fix" https://github.com/storybookjs/storybook/issues/28542
  optimizeDeps: {
    exclude: ['./node_modules/.cache/storybook'],
  },
});
