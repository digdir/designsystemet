import path from 'path';

import yargs from 'yargs';
import { registerTransforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';

import { nameKebab, typographyShorthand, sizeRem } from './transformers.js';
import { groupedTokens } from './formatters.js';

const argv = yargs(process.argv.slice(2))
  .options({
    brands: {
      type: 'array',
      default: [],
      describe: 'Brand files to build',
      alias: 'b',
    },
    tokens: {
      type: 'string',
      describe: 'Location for design-tokens',
      demandOption: true,
      alias: 't',
    },
    preview: {
      alias: 'p',
      type: 'boolean',
      describe: 'Generate typescript token preview files',
    },
  })
  .parseSync();

void registerTransforms(StyleDictionary);

const pickBrands = (x: string | number): x is string => typeof x === 'string';
type Brand = string;

const prefix = 'fds';
const basePxFontSize = 16;

const storefrontTokensPath = path.resolve('../../apps/storefront/tokens');
const packageTokensPath = path.resolve('../../packages/theme/brand');
const tokensPath = argv.tokens;

const fileHeader = () => [
  'Do not edit directly',
  `These files are generated from design tokens defined in Figma using Token Studio`,
];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(typographyShorthand);

StyleDictionary.registerTransformGroup({
  name: 'fds/css',
  transforms: [
    `ts/resolveMath`,
    nameKebab.name,
    sizeRem.name,
    typographyShorthand.name,
    'ts/size/lineheight',
    'ts/shadow/css/shorthand',
    'ts/color/modifiers',
    'ts/color/css/hexrgba',
  ],
});

const baseConfig = (brand: Brand): Partial<Config> => {
  return {
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

const getTokensPackageConfig = (brand: Brand, targetFolder = ''): Config => {
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
    ...baseConfig(brand),
    platforms: {
      css: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        files: [
          {
            destination: `${destinationPath}/tokens.css`,
            format: 'css/variables',
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

const getStorefrontConfig = (brand: Brand, targetFolder = ''): Config => {
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
    ...baseConfig(brand),
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
      },
    },
  };
};

const brands = argv.brands.filter(pickBrands) as string[];

if (brands.length > 0) {
  console.log('➡️  Recieved following brands: ', brands);

  console.log('🏗️  Start building CSS tokens');

  await Promise.all(
    brands.map(async (brand) => {
      console.log('\n---------------------------------------');

      console.log(`\n👷 Processing ${brand}`);

      const sd = new StyleDictionary();
      const tokensPackageSD = await sd.extend(
        getTokensPackageConfig(brand, packageTokensPath),
      );

      return tokensPackageSD.buildAllPlatforms();
    }),
  );

  console.log('\n---------------------------------------');
  console.log('\n🏁 Finished building package tokens!');
}

console.log('\n=======================================');
console.log('\n🏗️  Started building storefront tokens…');

await Promise.all(
  brands.map(async (brand) => {
    console.log('\n---------------------------------------');

    console.log(`\n👷 Processing ${brand}`);

    const storefrontSD = new StyleDictionary(
      getStorefrontConfig(brand, storefrontTokensPath),
    );

    return storefrontSD.buildAllPlatforms();
  }),
);

console.log('\n---------------------------------------');

console.log('\n🏁 Finished building storefront tokens!');
