import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
  stories: ['../packages/**/*.mdx', '../packages/**/*.stories.ts?(x)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-essentials',
    '@etchteam/storybook-addon-css-variables-theme',
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
        mdxLoaderOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    },
  ],
  staticDirs: ['../assets'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};
export default config;
