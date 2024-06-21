import path from 'path';
import fs from 'fs';

import type { ThemeObject } from '@tokens-studio/types';
import StyleDictionary from 'style-dictionary';
import * as R from 'ramda';
import chalk from 'chalk';

import * as configs from './configs.js';

const { permutateThemes, getConfigs } = configs;

type Options = {
  /** Design tokens path  */
  tokens: string;
  /** Output directoru for built tokens */
  out: string;
  /** Generate preview tokens */
  preview: boolean;
};

// type FormattedCSSPlatform = { css: { output: string; destination: string }[] };

const sd = new StyleDictionary();

export async function run(options: Options): Promise<void> {
  const tokensDir = options.tokens;
  const storefrontOutDir = path.resolve('../../apps/storefront/tokens');
  const tokensOutDir = path.resolve(options.out);

  const $themes = JSON.parse(fs.readFileSync(path.resolve(`${tokensDir}/$themes.json`), 'utf-8')) as ThemeObject[];

  const relevant$themes = $themes.filter((theme) => {
    const group = R.toLower(R.defaultTo('')(theme.group));
    // if (group === 'typography' && theme.name !== 'default') return false;
    if (group === 'size' && theme.name !== 'default') return false;

    return true;
  });

  const themes = permutateThemes(relevant$themes);

  const typographyThemes = R.filter((val) => val.mode === 'light', themes);
  const colormodeThemes = R.filter((val) => val.typography === 'primary', themes);
  const semanticThemes = R.filter((val) => val.mode === 'light' && val.typography === 'primary', themes);

  const colorModeConfigs = getConfigs(configs.colorModeVariables, tokensOutDir, tokensDir, colormodeThemes);
  const semanticConfigs = getConfigs(configs.semanticVariables, tokensOutDir, tokensDir, semanticThemes);
  const typographyConfigs = getConfigs(configs.typographyCSS, tokensOutDir, tokensDir, typographyThemes);
  const storefrontConfigs = getConfigs(configs.typescriptTokens, storefrontOutDir, tokensDir, colormodeThemes);

  if (typographyConfigs.length > 0) {
    console.log(`\n🍱 Building ${chalk.green('typography')}`);

    await Promise.all(
      typographyConfigs.map(async ({ theme, typography, config }) => {
        console.log(`👷 Processing: ${theme} - ${typography}`);

        const typographyClasses = await sd.extend(config);

        return typographyClasses.buildAllPlatforms();
      }),
    );
  }

  if (semanticConfigs.length > 0) {
    console.log(`\n🍱 Building ${chalk.green('semantic')}`);

    await Promise.all(
      semanticConfigs.map(async ({ theme, config, semantic }) => {
        console.log(`👷 Processing: ${theme} - ${semantic}`);

        const typographyClasses = await sd.extend(config);

        return typographyClasses.buildAllPlatforms();
      }),
    );
  }

  if (colorModeConfigs.length > 0) {
    console.log(`\n🍱 Building ${chalk.green('color-mode')}`);

    await Promise.all(
      colorModeConfigs.map(async ({ theme, mode, config }) => {
        console.log(`👷 Processing: ${theme} - ${mode}`);

        const themeVariablesSD = await sd.extend(config);

        return themeVariablesSD.buildAllPlatforms();
      }),
    );
  }

  if (storefrontConfigs.length > 0 && options.preview) {
    console.log(`\n🍱 Building ${chalk.bgGreen('Storefront')}`);

    await Promise.all(
      storefrontConfigs.map(async ({ theme, mode, config }) => {
        console.log(`👷 Processing: ${theme} - ${mode}`);

        const storefrontSD = await sd.extend(config);

        return storefrontSD.buildAllPlatforms();
      }),
    );
  }
}
