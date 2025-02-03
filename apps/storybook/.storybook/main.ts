import { resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import type { PropItem } from 'react-docgen-typescript';

const dirname = import.meta.dirname || __dirname;

const config: StorybookConfig = {
  typescript: {
    check: true,
    /* If in prod, use docgen-typescript, locally use docgen */
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      include: [resolve(dirname, '../../../packages/react/**/**.tsx')], // <- This is the important line.
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop: PropItem) => {
        // Keep the default filter logic from storybook:
        // https://github.com/storybookjs/storybook/blob/40523765403480c4065373664553bb6cbdf9543d/code/core/src/core-server/presets/common-preset.ts#L169C5-L169C98
        const defaultLogicFromStorybook = prop.parent
          ? !/node_modules/.test(prop.parent.fileName)
          : true;
        return defaultLogicFromStorybook && prop.name !== 'popovertarget'; // Skip popovertarget @types/react-dom patch}
      },
    },
  },
  stories: [
    '../stories/*.mdx',
    '../stories/*.stories.ts?(x)',
    '../../../packages/*.mdx',
    '../../../packages/css/**/*.mdx',
    '../../../packages/theme/**/*.mdx',
    '../../../packages/react/**/*.mdx',
    '../../../packages/react/**/*.stories.ts?(x)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-storysource',
    '@storybook/addon-themes',
    'storybook-addon-pseudo-states',
    '@storybook/experimental-addon-test',
  ],
  staticDirs: ['../assets'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: resolve(dirname, '../../../vite.config.ts'),
      },
    },
  },
};

export default config;
