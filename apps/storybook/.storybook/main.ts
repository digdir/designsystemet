import { dirname, join, resolve } from 'node:path';
import { env } from 'node:process';

import type { StorybookConfig } from '@storybook/react-vite';
import type { PropItem } from 'react-docgen-typescript';

const config: StorybookConfig = {
  typescript: {
    check: true,
    /* If in prod, use docgen-typescript, locally use docgen */
    reactDocgen:
      env.NODE_ENV === 'production'
        ? 'react-docgen-typescript'
        : 'react-docgen',
    /**
     * Enable this when docgen-typescript is faster
     * See: https://github.com/storybookjs/storybook/issues/28269
     */
    /* reactDocgen: 'react-docgen-typescript', */
    reactDocgenTypescriptOptions: {
      include: [resolve(__dirname, '../../../packages/react/**/**.tsx')], // <- This is the important line.
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: ({ name, declarations = [] }: PropItem) => {
      /* Default from `react-docgen-typescript` we have to add back when using a custom prop filter */
        const hasDescription = declarations.some(
          ({ fileName }) => !fileName.includes('node_modules'),
        );

        return hasDescription && name !== 'popovertarget'; // Skip popovertarget @types/react-dom patch
      },
    },
  },
  stories: [
    '../../../packages/*.mdx',
    '../../../packages/css/**/*.mdx',
    '../../../packages/theme/**/*.mdx',
    '../../../packages/react/**/*.mdx',
    '../../../packages/react/**/*.stories.ts?(x)',
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
  ],
  staticDirs: ['../assets'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: resolve(__dirname, '../../../vite.config.ts'),
      },
    },
  },
};

export default config;

function getAbsolutePath(value: string): StorybookConfig['framework'] {
  return dirname(
    require.resolve(join(value, 'package.json')),
  ) as StorybookConfig['framework'];
}
