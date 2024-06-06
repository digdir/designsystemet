import path from 'path';
import fs from 'fs';

import type { ThemeObject } from '@tokens-studio/types';
import StyleDictionary from 'style-dictionary';
import * as R from 'ramda';

import { getConfigs, tokensConfig, previewConfig, typographyConfig, permutateThemes } from './configs.js';

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

  const themes = permutateThemes($themes);

  const tokenConfigs = getConfigs(tokensConfig, tokensOutDir, tokensDir, themes);
  const storefrontConfigs = getConfigs(previewConfig, storefrontOutDir, tokensDir, themes);
  const typographyConfigs = getConfigs(
    typographyConfig,
    tokensOutDir,
    tokensDir,
    R.pickBy((_, key) => R.startsWith('light', R.toLower(key)), themes),
  );

  if (typographyConfigs.length > 0) {
    console.log('🍱 Bulding typography classes');
    console.log('➡️  Tokens path: ', tokensDir);

    await Promise.all(
      typographyConfigs.map(async ([name, config]) => {
        console.log(`👷 Processing ${name as string}`);

        const typographyClasses = await sd.extend(config);

        return typographyClasses.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building Typography classes!');
  }

  if (tokenConfigs.length > 0) {
    console.log('🍱 Building CSS variables from tokens');
    console.log('➡️  Tokens path: ', tokensDir);
    await Promise.all(
      tokenConfigs.map(async ([name, config]) => {
        console.log(`👷 Processing ${name as string}`);

        const tokensPackageSD = await sd.extend(config);

        return tokensPackageSD.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building CSS variables!');
  }

  if (storefrontConfigs.length > 0 && options.preview) {
    console.log('\n🏗️  Building storefront js tokens');
    await Promise.all(
      storefrontConfigs.map(async ([name, config]) => {
        console.log(`👷 Processing ${name as string}`);

        const storefrontSD = await sd.extend(config);

        return storefrontSD.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building storefront tokens');
  }
}
