import { dirname, join, resolve } from 'path';

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  stories: [
    '../../packages/*.mdx',
    '../../packages/css/**/*.mdx',
    '../../packages/theme/**/*.mdx',
    '../../packages/react/**/*.mdx',
    '../../packages/react/**/*.stories.ts?(x)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    {
      name: 'storybook-css-modules',
      options: {
        cssModulesLoaderOptions: {
          importLoaders: 1,
          modules: {
            localIdentName: '[name]_[local]__[hash:base64:5]',
          },
        },
      },
    },
    getAbsolutePath('@storybook/addon-mdx-gfm'),
    getAbsolutePath('@chromatic-com/storybook'),
    '@storybook/addon-themes',
  ],
  staticDirs: ['./assets'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: resolve(__dirname, '../..//vite.config.ts'),
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
