import path from 'path';

import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';

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
    log: { verbosity: 'silent' },
    include: [
      `${tokensPath}/Brand/${brand}.json`,
      `${tokensPath}/Base/Semantic.json`,
    ],
    source: [`${tokensPath}/Base/Core.json`],
  };
};

const excludeSource = (token: TransformedToken) => {
  if (token.filePath.includes('Core.json')) return false;

  if (token.path[0] === 'viewport' && ['color'].includes(token.type as string))
    return false;

  return true;
};

const getCSSTokensConfig = (
  brand: Brand,
  targetFolder = '',
  tokensPath: string,
): Config => {
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
    ...baseConfig(brand, tokensPath),
    platforms: {
      css: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        files: [
          {
            destination: `${destinationPath}/tokens.css`,
            format: scopedReferenceVariables.name,
            filter: excludeSource,
          },
        ],
        options: {
          fileHeader,
          includeReferences: (token: TransformedToken) =>
            ['color'].includes(token.type as string) &&
            !(token.value as string).startsWith('rgba'),
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
  const brands = options.brands;

  const storefrontTokensPath = path.resolve('../../apps/storefront/tokens');
  const packageTokensPath = path.resolve('../../packages/theme/brand');
  const tokensPath = options.tokens;

  if (brands.length > 0) {
    console.log('🍱 Staring token builder');
    console.log('➡️  Tokens path: ', tokensPath);
    console.log('➡️  Brands: ', brands);

    console.log('\n🏗️  Start building CSS tokens');
    await Promise.all(
      brands.map(async (brand) => {
        console.log(`👷 Processing ${brand}`);

        const sd = new StyleDictionary();
        const tokensPackageSD = await sd.extend(
          getCSSTokensConfig(brand, packageTokensPath, tokensPath),
        );

        return tokensPackageSD.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building package tokens!');

    console.log('\n🏗️  Started building storefront tokens…');
    await Promise.all(
      brands.map(async (brand) => {
        console.log(`👷 Processing ${brand}`);

        const storefrontSD = new StyleDictionary(
          getStorefrontConfig(brand, storefrontTokensPath, tokensPath),
        );

        return storefrontSD.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building storefront tokens!');
  }
}
