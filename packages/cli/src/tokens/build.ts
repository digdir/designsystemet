import path from 'path';
import fs from 'fs';

import {
  registerTransforms,
  permutateThemes,
} from '@tokens-studio/sd-transforms';
import type { ThemeObject } from '@tokens-studio/types';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import * as R from 'ramda';

import { nameKebab, typographyShorthand, sizeRem } from './transformers.js';
import { groupedTokens, scopedReferenceVariables } from './formatters.js';

void registerTransforms(StyleDictionary);

type Brand = string;

const prefix = 'fds';
const basePxFontSize = 16;

const fileHeader = () => [
  'Do not edit directly',
  `These files are generated from design tokens defined in Figma using Token Studio`,
];

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
    'ts/shadow/css/shorthand',
  ],
});

const baseConfig = (brand: Brand, tokensPath: string): Partial<Config> => {
  return {
    log: { verbosity: 'verbose' },
    include: [
      `${tokensPath}/themes/${brand}.json`,
      `${tokensPath}/semantic/**/*.json`,
    ],
    source: [`${tokensPath}/core/**/*.json`],
  };
};

const excludeSource = (token: TransformedToken) => {
  if (token.filePath.includes('core/**/*.json')) return false;

  if (token.path[0] === 'viewport' && ['color'].includes(token.type as string))
    return false;

  return true;
};

const getCSSConfig = (brand: Brand, targetFolder = ''): Config => {
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}/`;

  return {
    log: { verbosity: 'verbose' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        buildPath: destinationPath,
        files: [
          {
            destination: `tokens.css`,
            format: scopedReferenceVariables.name,
            filter: excludeSource,
          },
        ],
        options: {
          fileHeader,
          includeReferences: (token: TransformedToken) => {
            if (
              token.name.match(/accent|neutral|brand1|brand2|brand3/) &&
              token.filePath.includes('semantic/color')
            ) {
              return true;
            }

            if (
              token.name.match(/global/) &&
              token.filePath.includes('core/modes')
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

const getStorefrontConfig = (
  brand: Brand,
  targetFolder = '',
  tokensPath: string,
): Config => {
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
    ...baseConfig(brand, tokensPath),
    platforms: {
      storefront: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        files: [
          {
            destination: `${destinationPath}.ts`,
            format: groupedTokens.name,
            filter: excludeSource,
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
  /** File names of Token studio brand files located in  @type {Options['tokens']} */
  brands: string[];
};

export async function run(options: Options): Promise<void> {
  const tokensPath = options.tokens;
  const themeNames = options.brands;

  const $themes = JSON.parse(
    fs.readFileSync(path.resolve(`${tokensPath}/$themes.json`), 'utf-8'),
  ) as ThemeObject[];

  const themes = permutateThemes($themes, {
    separator: '_',
  }) as Record<string, string[]>;

  const brands = Object.entries(themes).map(([name]) => name);

  // const storefrontTokensPath = path.resolve('../../apps/storefront/tokens');
  const packageTokensPath = path.resolve('../../packages/theme/brand');

  const configs = Object.entries(themes).map(([name, tokensets]) => {
    const updatedSets = tokensets.map((x) =>
      path.resolve(`${tokensPath}/${x}.json`),
    );

    const updatedName = name.replace('_semantic', '');

    const [source, include] = R.partition(
      R.includes('core/modes'),
      updatedSets,
    );

    const config_ = getCSSConfig(updatedName, packageTokensPath);

    const config = {
      ...config_,
      source,
      include,
    };

    console.log(config);

    return [updatedName, config];
  });

  if (brands.length > 0) {
    console.log('🍱 Staring token builder');
    console.log('➡️  Tokens path: ', tokensPath);
    console.log('➡️  Brands: ', brands);

    console.log('\n🏗️  Start building CSS tokens');
    await Promise.all(
      configs.map(async ([name, config]) => {
        console.log(`👷 Processing ${name as string}`);

        const sd = new StyleDictionary();
        const tokensPackageSD = await sd.extend(config);

        return tokensPackageSD.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building package tokens!');

    // console.log('\n🏗️  Started building storefront tokens…');
    // await Promise.all(
    //   brands.map(async (brand) => {
    //     console.log(`👷 Processing ${brand}`);

    //     const storefrontSD = new StyleDictionary(
    //       getStorefrontConfig(brand, storefrontTokensPath, tokensPath),
    //     );

    //     return storefrontSD.buildAllPlatforms();
    //   }),
    // );
    // console.log('🏁 Finished building storefront tokens!');
  }
}
