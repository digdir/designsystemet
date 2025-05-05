import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';
import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from '../../vite.config';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      storybookTest({
        configDir: path.join(dirname, '.storybook'),
        storybookScript: 'pnpm dev --ci',
      }),
    ],
    test: {
      exclude: ['./../../packages/**/*.chromatic.tsx'],
      watch: false,
      browser: {
        enabled: true,
        instances: [{ browser: 'chromium' }],
        provider: 'playwright',
        headless: true,
      },
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
  }),
);
