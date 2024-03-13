import { dirname, join } from 'path';
import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
  stories: [
    '../packages/*.mdx',
    '../packages/!(react-old)**/*.mdx',
    '../packages/!(react-old)**/*.stories.ts?(x)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@etchteam/storybook-addon-css-variables-theme'),
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
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  staticDirs: ['../assets'],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: { builder: { useSWC: true } },
  },
  docs: {
    autodocs: true,
  },
  swc: (config, options) => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
