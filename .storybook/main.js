const path = require('node:path');

module.exports = {
  stories: ['../packages/**/*.stories.mdx', '../stories/**/*.stories.mdx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-designs',
    '@storybook/preset-scss',
    '@etchteam/storybook-addon-status',
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
  ],
  staticDirs: ['../assets'],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
};
