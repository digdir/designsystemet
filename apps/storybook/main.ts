import { dirname, join, resolve } from 'path';

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  docs: {
    autodocs: true,
  },
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
    '@chromatic-com/storybook',
  ],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
  staticDirs: ['./assets'],
  framework: getAbsolutePath('@storybook/react-vite'),
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@doc-components': resolve(__dirname, './docs-components'),
          '@assets': resolve(__dirname, './assets'),
        },
      },
    });
  },
};
export default config;

function getAbsolutePath(value: string): StorybookConfig['framework'] {
  return dirname(
    require.resolve(join(value, 'package.json')),
  ) as StorybookConfig['framework'];
}
