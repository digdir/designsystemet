import { dirname, join, resolve } from 'node:path';
import { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  typescript: {
    check: true,
  },
  stories: [
    '../stories/*.mdx',
    '../stories/*.stories.ts?(x)',
    // '../../../packages/*.mdx', // Part of the main documentation
    // '../../../packages/css/**/*.mdx',
    // '../../../packages/theme/**/*.mdx',
    '../../../packages/web-components/**/*.mdx',
    '../../../packages/web-components/**/*.stories.ts?(x)'
  ],
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-mdx-gfm'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-storysource'),
    '@storybook/addon-themes',
    'storybook-addon-pseudo-states',
  ],
  staticDirs: ['../assets'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {
      builder: {
        viteConfigPath: resolve(__dirname, '../vite.config.ts'),
      },
    },
  },
};

export default config;

function getAbsolutePath(value: string) {
  return dirname(
    require.resolve(join(value, 'package.json')),
  );
}
