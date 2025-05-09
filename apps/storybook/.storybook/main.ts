import path, { resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import * as R from 'ramda';
import type { PropItem } from 'react-docgen-typescript';
import { defineConfig, mergeConfig } from 'vite';

const dirname = import.meta.dirname || __dirname;

const resolveAliasFromroot = (alias: string): string =>
  path.resolve(dirname, '../../..', alias);

const resolveAliases = R.map(resolveAliasFromroot);

const config: StorybookConfig = {
  viteFinal: (config) =>
    mergeConfig(
      config,
      defineConfig({
        resolve: {
          alias: resolveAliases({
            '@assets': 'apps/storybook/assets',
            '@doc-components': 'apps/storybook/docs-components',
            '@story-utils': 'apps/storybook/story-utils',
          }),
        },
      }),
    ),
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
    '../stories/**/*.mdx',
    '../stories/**/*.@(stories|chromatic).@(ts|tsx)',
    '../../../packages/*.mdx',
    '../../../packages/*/!(node_modules)/**/*.mdx',
    '../../../packages/*/!(node_modules)/**/*.@(stories|chromatic).@(ts|tsx)',
  ],
  experimental_indexers: (existingIndexers) => {
    /*
     * The following is required in order to process .chromatic.tsx with the default indexer
     */
    if (!existingIndexers) {
      return [];
    }
    // find the default `.stories.tsx` indexer
    const storiesIndexer = existingIndexers.find((x) =>
      x.test.test('stories.tsx'),
    );
    if (!storiesIndexer) {
      throw new Error("Couldn't find the default indexer");
    }
    const customIndexer = {
      test: /\.chromatic\.tsx?$/,
      createIndex: storiesIndexer?.createIndex,
    };
    return [...existingIndexers, customIndexer];
  },
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-storysource',
    '@storybook/addon-themes',
    'storybook-addon-pseudo-states',
    '@storybook/experimental-addon-test',
    '@whitespace/storybook-addon-html',
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
  tags: (_, options) => {
    return {
      // Configure stories with the 'chromatic' tag to only be visible in development.
      // In production, they will be picked up by snapshot tests etc but not be visible.
      chromatic: {
        excludeFromDocsStories: true,
        excludeFromSidebar: options.configType === 'PRODUCTION',
      },
    };
  },
};

export default config;
