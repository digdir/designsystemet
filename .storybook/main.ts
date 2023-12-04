import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/react-webpack5';
import { generateScopedName } from '../packages/react/scripts/name';

const config: StorybookConfig = {
  stories: ['../packages/**/*.mdx', '../packages/**/*.stories.ts?(x)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-essentials',
    '@etchteam/storybook-addon-css-variables-theme',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    // localIdentName: generateScopedName,
                    // https://github.com/webpack-contrib/css-loader#getlocalident
                    getLocalIdent: (
                      context: { resourcePath: string },
                      _: string,
                      localName: string,
                    ) => {
                      return generateScopedName(
                        localName,
                        context.resourcePath,
                      );
                    },
                  },
                },
              },
            ],
          },
        ],
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
    name: '@storybook/react-webpack5',
    options: {},
  },
  core: {
    builder: '@storybook/builder-webpack5',
  },
  docs: {
    autodocs: true,
  },
};
export default config;
