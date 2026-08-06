import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      // {
      //   test: {
      //     name: 'Playwright',
      //     setupFiles: ['./vitest.setup.ts'],
      //     fakeTimers: {
      //       shouldAdvanceTime: true,
      //     },
      //     browser: {
      //       enabled: true,
      //       provider: playwright(),
      //       headless: true,
      //       // https://vitest.dev/config/browser/playwright
      //       instances: [
      //         { browser: 'chromium' },
      //         { browser: 'firefox' },
      //         { browser: 'webkit' },
      //       ],
      //     },
      //   },
      // },
      {
        test: {
          name: 'JSDOM',
          exclude: ['**/*.browser.test.*'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          fakeTimers: {
            shouldAdvanceTime: true,
          },
        },
      },
      // {
      //   test: {
      //     name: 'Happy DOM',
      //     environment: 'happy-dom',
      //     setupFiles: ['./vitest.setup.ts'],
      //     fakeTimers: {
      //       shouldAdvanceTime: true,
      //     },
      //   },
      // },
    ],
  },
});
