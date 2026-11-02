import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    tags: [
      {
        name: 'browser',
        description: 'Should only run in true browser environment.',
      },
    ],
    projects: [
      {
        test: {
          name: 'Playwright',
          setupFiles: ['./vitest.setup.ts'],
          fakeTimers: {
            shouldAdvanceTime: true,
          },
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            // https://vitest.dev/config/browser/playwright
            instances: [
              { browser: 'chromium' },
              { browser: 'firefox' },
              { browser: 'webkit' },
            ],
          },
        },
      },
      {
        test: {
          name: 'JSDOM',
          environment: 'jsdom',
          fakeTimers: { shouldAdvanceTime: true },
          setupFiles: ['./vitest.setup.ts'],
          exclude: ['**/*.browser.test.*'], // Skip browser test files
          tags: [{ name: 'browser', skip: true }], // Skip browser test tags
        },
      },
      {
        test: {
          name: 'Happy DOM',
          environment: 'happy-dom',
          fakeTimers: { shouldAdvanceTime: true },
          setupFiles: ['./vitest.setup.ts'],
          exclude: ['**/*.browser.test.*'], // Skip browser test files
          tags: [{ name: 'browser', skip: true }], // Skip browser test tags
        },
      },
    ],
  },
});
