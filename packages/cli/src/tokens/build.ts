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
    if (group === 'typography' && theme.name !== 'default') return false;
    if (group === 'size' && theme.name !== 'default') return false;

    return true;
  });

  const themes = permutateThemes(relevant$themes);
  const semanticThemes = R.pickBy<Record<string, string[]>, Record<string, string[]>>(
    (_, key) => R.startsWith('light', R.toLower(key)),
    themes,
  );

  const colorModeConfigs = getConfigs(configs.colorModeVariables, tokensOutDir, tokensDir, themes);
  const semanticConfigs = getConfigs(configs.semanticVariables, tokensOutDir, tokensDir, semanticThemes);
  const storefrontConfigs = getConfigs(configs.typescriptTokens, storefrontOutDir, tokensDir, themes);
  const typographyConfigs = getConfigs(configs.typographyCSS, tokensOutDir, tokensDir, semanticThemes);

  if (typographyConfigs.length > 0) {
    console.log(`\n🍱 Building ${chalk.green('typography')}`);

    await Promise.all(
      typographyConfigs.map(async ({ name, config }) => {
        const typographyTheme = name.split('-')[0];
        console.log(`👷 Processing: ${typographyTheme}`);

        const typographyClasses = await sd.extend(config);

        return typographyClasses.buildAllPlatforms();
      }),
    );
  }

  if (semanticConfigs.length > 0) {
    console.log(`\n🍱 Building ${chalk.green('semantic')}`);

    await Promise.all(
      semanticConfigs.map(async ({ name, config }) => {
        const typographyTheme = name.split('-')[0];
        console.log(`👷 Processing: ${typographyTheme}`);

        const typographyClasses = await sd.extend(config);

        return typographyClasses.buildAllPlatforms();
      }),
    );
  }

  if (colorModeConfigs.length > 0) {
    console.log(`\n🍱 Building ${chalk.green('color-mode')}`);

    await Promise.all(
      colorModeConfigs.map(async ({ name, config }) => {
        console.log(`👷 Processing: ${name}`);

        const themeVariablesSD = await sd.extend(config);

        return themeVariablesSD.buildAllPlatforms();
      }),
    );
  }

  if (storefrontConfigs.length > 0 && options.preview) {
    console.log(`\n🍱 Building ${chalk.bgGreen('Storefront')}`);

    await Promise.all(
      storefrontConfigs.map(async ({ name, config }) => {
        console.log(`👷 Processing: ${name}`);

        const storefrontSD = await sd.extend(config);

        return storefrontSD.buildAllPlatforms();
      }),
    );
  }
}
