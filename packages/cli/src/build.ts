#!/usr/bin/env node
import path from 'path';

import StyleDictionary from 'style-dictionary';
import type {
  Config,
  TransformedToken,
  Named,
  FileHeader,
} from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';
import yargs from 'yargs';

import {
  sizePx,
  nameKebab,
  nameKebabUnderscore,
  typographyShorthand,
  fluidFontSize,
  calc,
  fontScaleHackFormat,
  sizeRem,
} from './transformers.js';
import { scopedReferenceVariables, groupedTokens } from './formatters.js';

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
const fileheader: Named<{ fileHeader: FileHeader }> = {
  name: 'fileheader',
  fileHeader: () => [
    'Do not edit directly',
    `These files are generated from design tokens defined in Figma using Token Studio`,
  ],
};

const storefrontTokensPath = path.resolve('../../apps/storefront/tokens');
const packageTokensPath = path.resolve('../../packages/theme/brand');
const tokensPath = argv.tokens;

StyleDictionary.registerTransform(sizePx);
StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(nameKebabUnderscore);
StyleDictionary.registerTransform(typographyShorthand);
StyleDictionary.registerTransform(fluidFontSize);
StyleDictionary.registerTransform(calc);

StyleDictionary.registerFormat(fontScaleHackFormat);
StyleDictionary.registerFormat(scopedReferenceVariables);
StyleDictionary.registerFormat(groupedTokens);

StyleDictionary.registerFileHeader(fileheader);

StyleDictionary.registerTransformGroup({
  name: 'fds/css',
  transforms: [
    'ts/resolveMath',
    nameKebab.name,
    typographyShorthand.name,
    'ts/size/lineheight',
    sizeRem.name,
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

const excludeSource = (token: TransformedToken) =>
  !token.filePath.includes('Core.json');

const getTokensPackageConfig = (brand: Brand, targetFolder = ''): Config => {
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
    ...baseConfig(brand),
    platforms: {
      hack: {
        prefix,
        basePxFontSize,
        transforms: ['ts/resolveMath', nameKebab.name],
        files: [
          {
            format: 'global-values-hack',
            destination: 'ignore/hack',
          },
        ],
      },
      css: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        files: [
          {
            destination: `${destinationPath}/tokens.css`,
            format: 'css/variables-scoped-references',
            // filter: excludeSource,
          },
        ],
        options: {
          fileHeader: fileheader.name,
          referencesFilter: (token: TransformedToken) =>
            !(token.path[0] === 'viewport') &&
            ['color'].includes(token.type as string),
          // outputReferences: true,
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
      hack: {
        prefix,
        basePxFontSize,
        transforms: ['ts/resolveMath', nameKebab.name],
        files: [
          {
            format: 'global-values-hack',
            destination: 'ignore/hack',
          },
        ],
      },
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
          fileHeader: fileheader.name,
        },
      },
    },
  };
};

const brands = argv.brands.filter(pickBrands) as string[];

if (brands.length > 0) {
  console.log('➡️  Recieved following brands: ', brands);

  console.log('🏗️  Start building CSS tokens');

  brands.map((brand) => {
    console.log('\n---------------------------------------');

    console.log(`\n👷 Processing ${brand}`);

    const tokensPackageSD = StyleDictionary.extend(
      getTokensPackageConfig(brand, packageTokensPath),
    );

    tokensPackageSD.buildAllPlatforms();
  });

  console.log('\n---------------------------------------');
  console.log('\n🏁 Finished building package tokens!');
}

console.log('\n=======================================');
console.log('\n🏗️  Started building storefront tokens…');

brands.map((brand) => {
  console.log('\n---------------------------------------');

  console.log(`\n👷 Processing ${brand}`);

  const storefrontSD = StyleDictionary.extend(
    getStorefrontConfig(brand, storefrontTokensPath),
  );

  storefrontSD.buildAllPlatforms();
});

console.log('\n---------------------------------------');

console.log('\n🏁 Finished building storefront tokens!');
