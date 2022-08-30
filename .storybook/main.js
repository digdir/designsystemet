const path = require("path");

module.exports = {
  stories: [
    "../docs-main/**/*.stories.@(js|ts|tsx|mdx)",
    "../packages/**/*.stories.@(js|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-scss",
    "@storybook/theming",
    "@storybook/addon-a11y",
    "storybook-addon-designs",
  ],
  typescript: {
    check: false,
  },
  staticDirs: ["../assets"],
  core: {
    builder: "webpack5",
  },
  // Add rules to webpack config
  webpackFinal: async (config, { configType }) => {
    // Resolve raw import of SVG files as source code
    config.module.rules.push({
      test: /\.svg/,
      type: "asset/source",
    });
    return config;
  },
};
