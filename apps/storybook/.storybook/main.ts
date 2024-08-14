import { dirname, join, resolve } from 'node:path';
import { env } from 'node:process';

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  typescript: {
    /* If in prod, use docgen-typescript, locally use docgen */
    reactDocgen: 'react-docgen-typescript',
    /**
     * Enable this when docgen-typescript is faster
     * See: https://github.com/storybookjs/storybook/issues/28269
     */
    /* reactDocgen: 'react-docgen-typescript', */
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      include: ['**/src/**/*.{ts,tsx}'],
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      tsconfigPath: resolve(__dirname, '../../packages/react/tsconfig.json'),
    },
  },
  stories: [
    '../../../packages/*.mdx',
    '../../../packages/css/**/*.mdx',
    '../../../packages/theme/**/*.mdx',
    '../../../packages/react/**/*.mdx',
    '../../../packages/react/**/*.stories.ts?(x)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('@storybook/addon-mdx-gfm'),
    getAbsolutePath('@chromatic-com/storybook'),
    '@storybook/addon-themes',
  ],
  staticDirs: ['../assets'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: resolve(__dirname, '../../../vite.config.ts'),
      },
    },
  },
};

export default config;

function getAbsolutePath(value: string): StorybookConfig['framework'] {
  return dirname(
    require.resolve(join(value, 'package.json')),
  ) as StorybookConfig['framework'];
}
