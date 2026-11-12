import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { mergeConfig } from 'vitest/config';

import viteConfig from '../../vite.config';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(viteConfig, {
  plugins: [
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
      storybookScript: 'pnpm dev --ci',
    }),
  ],
  test: {
    exclude: ['./../../packages/**/*.chromatic.tsx', './../../**/*.mdx'],
    watch: false,
    browser: {
      enabled: true,
      instances: [
        { browser: 'chromium' },
        // Some elements are only shown on small screens, e.g. the back link in Breadcrumbs.
        // Run the stories at mobile width as well, so the a11y checks cover them.
        // Storybook sets the viewport for each story from its globals, so a browser `viewport` here has no effect.
        // The key is the one @storybook/addon-vitest reads initial globals from.
        {
          browser: 'chromium',
          name: 'chromium-mobile',
          provide: {
            'storybook/test-initial-globals': { viewport: { value: '320px' } },
          },
        },
      ],
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
