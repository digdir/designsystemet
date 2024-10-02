import fs from 'node:fs';
import path from 'node:path';

import type { ThemeObject } from '@tokens-studio/types';
import chalk from 'chalk';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';

import * as configs from './build/configs.js';
import { makeEntryFile } from './build/utils/entryfile.js';

const { permutateThemes, getConfigs } = configs;

type Options = {
  /** Design tokens path  */
  tokens: string;
  /** Output directoru for built tokens */
  out: string;
  /** Generate preview tokens */
  preview: boolean;
  /** Enable verbose output */
  verbose: boolean;
};

// type FormattedCSSPlatform = { css: { output: string; destination: string }[] };

const sd = new StyleDictionary();

export async function buildTokens(options: Options): Promise<void> {
  const verbosity = options.verbose ? 'verbose' : 'silent';
  const tokensDir = options.tokens;
  const storefrontOutDir = path.resolve('../../apps/storefront/tokens');
  const outPath = path.resolve(options.out);

  const $themes = JSON.parse(fs.readFileSync(path.resolve(`${tokensDir}/$themes.json`), 'utf-8')) as ThemeObject[];

  const relevant$themes = $themes.filter((theme) => {
    const group = R.toLower(R.defaultTo('')(theme.group));
    if (group === 'size' && theme.name.toLowerCase() !== 'default') return false;

    return true;
  });

  const themes = permutateThemes(relevant$themes);

  const typographyThemes = R.filter((val) => val.mode === 'light', themes);
  const colormodeThemes = R.filter((val) => val.typography === 'primary', themes);
  const semanticThemes = R.filter((val) => val.mode === 'light' && val.typography === 'primary', themes);

  const colorModeConfigs = getConfigs(configs.colorModeVariables, outPath, tokensDir, colormodeThemes, verbosity);
  const semanticConfigs = getConfigs(configs.semanticVariables, outPath, tokensDir, semanticThemes, verbosity);
  const typographyConfigs = getConfigs(configs.typographyVariables, outPath, tokensDir, typographyThemes, verbosity);
  const storefrontConfigs = getConfigs(
    configs.typescriptTokens,
    storefrontOutDir,
    tokensDir,
    colormodeThemes,
    verbosity,
  );

  try {
    if (typographyConfigs.length > 0) {
      console.log(`\n🍱 Building ${chalk.green('typography')}`);

      await Promise.all(
        typographyConfigs.map(async ({ theme, typography, config }) => {
          console.log(`👷 ${theme} - ${typography}`);

          const typographyClasses = await sd.extend(config);

          return typographyClasses.buildAllPlatforms();
        }),
      );
    }

    if (colorModeConfigs.length > 0) {
      console.log(`\n🍱 Building ${chalk.green('color-mode')}`);

      await Promise.all(
        colorModeConfigs.map(async ({ theme, mode, config }) => {
          console.log(`👷 ${theme} - ${mode}`);

          const themeVariablesSD = await sd.extend(config);

          return themeVariablesSD.buildAllPlatforms();
        }),
      );
    }

    if (semanticConfigs.length > 0) {
      console.log(`\n🍱 Building ${chalk.green('semantic')}`);

      await Promise.all(
        semanticConfigs.map(async ({ theme, config, semantic }) => {
          console.log(`👷 ${theme} - ${semantic}`);

          const typographyClasses = await sd.extend(config);

          return typographyClasses.buildAllPlatforms();
        }),
      );
    }

    if (storefrontConfigs.length > 0 && options.preview) {
      console.log(`\n🍱 Building ${chalk.green('Storefront preview tokens')}`);

      await Promise.all(
        storefrontConfigs.map(async ({ theme, mode, config }) => {
          console.log(`👷 ${theme} - ${mode}`);

          const storefrontSD = await sd.extend(config);

          return storefrontSD.buildAllPlatforms();
        }),
      );
    }

    if (semanticConfigs.length > 0) {
      console.log(`\n🍱 Building ${chalk.green('CSS file')}`);

      await Promise.all(
        semanticConfigs.map(async ({ theme }) => {
          console.log(`👷 ${theme}.css`);

          return makeEntryFile({ theme, outPath, buildPath: path.resolve(`${outPath}/${theme}`) });
        }),
      );
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
