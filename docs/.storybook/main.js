const path = require('node:path');

module.exports = {
  stories: [
    "../../packages/**/*.stories.mdx",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-designs",
  ],
  staticDirs: ["../assets"],
  framework: "@storybook/react",
  core: {
    builder: 'webpack5',
  },
}
