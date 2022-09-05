const path = require("path");

module.exports = {
  stories: ["../stories/**/*.stories.mdx", "../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/theming", "storybook-addon-designs"],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  staticDirs: ["../assets"],
  async viteFinal(config, { configType }) {
    // customize the Vite config here
    return {
      ...config,
      resolve: {
        alias: [
          {
            find: "@digdir/ds-core-react",
            replacement: path.resolve(
              __dirname,
              "../../../packages/ds-core-react/"
            ),
          },
        ],
      },
    };
  },
};
