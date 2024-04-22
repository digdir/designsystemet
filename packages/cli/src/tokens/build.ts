import path from 'path';
import fs from 'fs';

import { registerTransforms, permutateThemes } from '@tokens-studio/sd-transforms';
import type { ThemeObject } from '@tokens-studio/types';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import * as R from 'ramda';

import { nameKebab, typographyShorthand, sizeRem } from './transformers.js';
import { groupedTokens, scopedReferenceVariables } from './formatters.js';

void registerTransforms(StyleDictionary);

const prefix = 'fds';
const basePxFontSize = 16;
const separator = '_';

const fileHeader = () => [`These files are generated from design tokens defind using Token Studio`];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(typographyShorthand);

StyleDictionary.registerFormat(groupedTokens);
StyleDictionary.registerFormat(scopedReferenceVariables);

StyleDictionary.registerTransformGroup({
  name: 'fds/css',
  transforms: [
    `ts/resolveMath`,
    nameKebab.name,
    sizeRem.name,
    typographyShorthand.name,
    'ts/color/modifiers',
    'ts/color/css/hexrgba',
    'ts/size/lineheight',
    'ts/size/px',
    'ts/shadow/css/shorthand',
  ],
});

const processThemeName = R.pipe(R.replace(`${separator}semantic`, ''), R.toLower, R.split(separator));

type GetConfig = (options: { fileName: string; buildPath: string }) => Config;

const getCSSConfig: GetConfig = ({ fileName = 'unknown', buildPath = 'unknown' }) => {
  return {
    log: { verbosity: 'verbose' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        buildPath,
        files: [
          {
            destination: `${fileName}.css`,
            format: scopedReferenceVariables.name,
          },
        ],
        options: {
          fileHeader,
          includeReferences: (token: TransformedToken) => {
            if (
              R.test(/accent|neutral|brand1|brand2|brand3|success|danger|warning/, token.name) &&
              R.includes('semantic/color', token.filePath)
            ) {
              return true;
            }

            return false;
          },
        },
      },
    },
  };
};

const getStorefrontConfig = ({ fileName = 'unknown', buildPath = 'unknown' }): Config => {
  return {
    log: { verbosity: 'verbose' },
    preprocessors: ['tokens-studio'],
    platforms: {
      storefront: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        buildPath,
        files: [
          {
            destination: `${fileName}.ts`,
            format: groupedTokens.name,
            filter: (token) => {
              return R.not(R.includes('themes', token.filePath));
            },
          },
        ],
        options: {
          fileHeader,
        },
      },
    },
  };
};

type Options = {
  /** Design tokens path  */
  tokens: string;
  /** Output directoru for built tokens */
  out: string;
  /** Generate preview tokens */
  preview: boolean;
};

const sd = new StyleDictionary();

export async function run(options: Options): Promise<void> {
  const tokensPath = options.tokens;
  const storefrontTokensOutPath = path.resolve('../../apps/storefront/tokens');
  const packageTokensOutPath = path.resolve(options.out);

  const $themes = JSON.parse(fs.readFileSync(path.resolve(`${tokensPath}/$themes.json`), 'utf-8')) as ThemeObject[];

  const themes = permutateThemes($themes, {
    separator,
  }) as Record<string, string[]>;

  const getConfigs = (configCallback: GetConfig, outPath: string) =>
    Object.entries(themes)
      .map(([name, tokensets]) => {
        const updatedSets = tokensets.map((x) => `${tokensPath}/${x}.json`);

        const [fileName, folderName] = processThemeName(name);

        const paritionPrimitives = /(?!.*global\.json).*primitives.*/;
        // const paritionPrimitives = /.*primitives.*/;
        const [source, include] = R.partition(R.test(paritionPrimitives), updatedSets);

        const config_ = configCallback({
          fileName: fileName,
          buildPath: `${outPath}/${folderName}/`,
        });

        const config = {
          ...config_,
          source: source,
          include,
        };

        // console.log(config);

        return [`${folderName}: ${fileName}`, config];
      })
      .sort();

  const tokenConfigs = getConfigs(getCSSConfig, packageTokensOutPath);
  const storefrontConfigs = getConfigs(getStorefrontConfig, storefrontTokensOutPath);

  if (tokenConfigs.length > 0) {
    console.log('🍱 Staring token builder');
    console.log('➡️  Tokens path: ', tokensPath);

    console.log('\n🏗️  Start building CSS tokens');
    await Promise.all(
      tokenConfigs.map(async ([name, config]) => {
        console.log(`👷 Processing ${name as string}`);

        const tokensPackageSD = await sd.extend(config);

        return tokensPackageSD.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building package tokens!');
  }

  if (storefrontConfigs.length > 0 && options.preview) {
    console.log('\n🏗️  Started building storefront tokens…');
    await Promise.all(
      storefrontConfigs.map(async ([name, config]) => {
        console.log(`👷 Processing ${name as string}`);

        const storefrontSD = await sd.extend(config);

        return storefrontSD.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building storefront tokens!');
  }
}
