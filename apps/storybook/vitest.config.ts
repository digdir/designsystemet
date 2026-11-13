import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { mergeConfig } from 'vitest/config';

import viteConfig from '../../vite.config';
import { viewportWidths } from './story-utils/modes';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const storybookOptions = {
  configDir: path.join(dirname, '.storybook'),
  storybookScript: 'pnpm dev --ci',
};

// The narrowest viewport in `.storybook/preview.tsx`, where the options are named e.g. `320px`
const mobileViewport = `${Math.min(...viewportWidths)}px`;

export default mergeConfig(viteConfig, {
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest(storybookOptions)],
        test: { name: 'storybook' },
      },
      // Some elements are only shown on small screens, e.g. the back link in Breadcrumbs.
      // Run the stories at mobile width as well, so the a11y checks cover them.
      {
        extends: true,
        plugins: [
          storybookTest({
            ...storybookOptions,
            initialGlobals: { viewport: { value: mobileViewport } },
          }),
        ],
        test: { name: 'storybook-mobile' },
      },
    ],
    exclude: ['./../../packages/**/*.chromatic.tsx', './../../**/*.mdx'],
    watch: false,
    browser: {
      enabled: true,
      instances: [{ browser: 'chromium' }],
      provider: playwright(),
      headless: true,
    },
    testTimeout: 10000,
    setupFiles: ['./.storybook/vitest.setup.ts'],
    reporters: [
      'default',
      [
        'junit',
        {
          outputFile: 'test-report.xml',
          suiteName: 'Storybook tests',
          addFileAttribute: true,
          classnameTemplate: (vars: {
            filename: string;
            filepath: string;
          }): string =>
            vars.filename.split('../../packages/react/')[1] ?? vars.filename,
        },
      ],
    ],
  },
});
