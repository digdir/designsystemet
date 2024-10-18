import fs from 'node:fs';
import path from 'node:path';

import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';

import { configs, getConfigsForThemeDimension } from './build/configs.js';
import type { BuildConfig, ThemePermutation } from './build/types.js';
import { makeEntryFile } from './build/utils/entryfile.js';
import { getMultidimensionalThemes } from './build/utils/permutateThemes.js';

type Options = {
  /** Design tokens path */
  tokens: string;
  /** Output directory for built tokens */
  out: string;
  /** Generate preview tokens */
  preview: boolean;
  /** Enable verbose output */
  verbose: boolean;
};

export let buildOptions: Options | undefined;

const sd = new StyleDictionary();

/*
 * Declarative configuration of the build output
 */
const buildConfigs = {
  typography: { config: 'typographyVariables', modes: ['typography'] },
  'color-mode': { config: 'colorModeVariables', modes: ['mode'] },
  semantic: { config: 'semanticVariables', modes: ['semantic'] },
  storefront: {
    name: 'Storefront preview tokens',
    config: 'typescriptTokens',
    modes: ['mode'],
    options: { outPath: path.resolve('../../apps/storefront/tokens') },
  },
  entryFiles: {
    name: 'CSS entry files',
    config: 'semanticVariables',
    modes: ['semantic'],
    build: async (sdConfigs, { outPath }) => {
      await Promise.all(
        sdConfigs.map(async ({ theme }) => {
          console.log(`👷 ${theme}.css`);

          return makeEntryFile({ theme, outPath, buildPath: path.resolve(`${outPath}/${theme}`) });
        }),
      );
    },
  },
} satisfies Record<string, BuildConfig>;

export async function buildTokens(options: Options): Promise<void> {
  buildOptions = options;
  const tokensDir = options.tokens;
  const outPath = path.resolve(options.out);

  /*
   * Build the themes
   */
  const $themes = JSON.parse(fs.readFileSync(path.resolve(`${tokensDir}/$themes.json`), 'utf-8')) as ThemeObject[];

  // We only use the 'default' theme for the 'size' group
  const relevant$themes = $themes.filter((theme) =>
    R.not(theme.group === 'size' && theme.name.toLowerCase() !== 'default'),
  );

  const buildAndSdConfigs = R.map(
    (val: BuildConfig) => ({
      buildConfig: val,
      sdConfigs: getConfigsForThemeDimension(
        configs[val.config],
        getMultidimensionalThemes(relevant$themes, ...val.modes),
        {
          outPath,
          tokensDir,
          ...val.options,
        },
      ),
    }),
    buildConfigs,
  );

  try {
    for (const [key, { buildConfig, sdConfigs }] of R.toPairs(buildAndSdConfigs)) {
      if (sdConfigs.length > 0) {
        console.log(`\n🍱 Building ${chalk.green(buildConfig.name ?? key)}`);

        if (buildConfig.build) {
          return await buildConfig.build(sdConfigs, { outPath, tokensDir, ...buildConfig.options });
        }
        await Promise.all(
          sdConfigs.map(async ({ config, ...modeNames }) => {
            const modes: Array<keyof ThemePermutation> = ['theme', ...buildConfig.modes];
            const modeMessage = modes.map((x) => modeNames[x]).join(' - ');
            console.log(modeMessage);

            return (await sd.extend(config)).buildAllPlatforms();
          }),
        );
      }
    }
  } catch (err) {
    // Fix crash error message from StyleDictionary from
    //   > Use log.verbosity "verbose" or use CLI option --verbose for more details.
    // to
    //   > Use CLI option --verbose for more details.
    if (err instanceof Error) {
      err.message = err.message.replace('log.verbosity "verbose" or use ', '');
    }
    throw err;
  }
}
