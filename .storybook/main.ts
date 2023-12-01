import path from 'path';
import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from '@storybook/react-webpack5';
import { generateScopedName } from '../packages/react/scripts/name';
import cssnano from 'cssnano';

const config: StorybookConfig = {
  stories: ['../packages/**/*.mdx', '../packages/**/*.stories.ts?(x)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-essentials',
    '@etchteam/storybook-addon-css-variables-theme',
    // {
    //   name: 'storybook-css-modules',
    //   options: {
    //     cssModulesLoaderOptions: {
    //       importLoaders: 1,
    //       modules: {
    //         localIdentName: generateScopedName,
    //       },
    //     },
    //   },
    // },
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          'style-loader',
          'ccs-loader',
          {
            test: /\.css$/,
            use: [
              {
                loader: 'postcss-loader',
                options: {
                  importLoaders: 1,
                  postcssOptions: {
                    modules: {
                      generateScopedName,
                    },
                    plugins: [cssnano({ preset: 'default' })],
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
  // webpackFinal: async (config) => {
  //   config.module?.rules?.push({
  //     test: /\.css$/,
  //     use: [
  //       {
  //         loader: 'postcss-loader',
  //         options: {
  //           postcssOptions: {
  //             modules: {
  //               generateScopedName,
  //             },
  //             plugins: [cssnano({ preset: 'default' })],
  //           },
  //         },
  //       },
  //     ],
  //     include: path.resolve(__dirname, '../'),
  //   });
  //   return config;
  // },
};
export default config;
