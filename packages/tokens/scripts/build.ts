import fs from 'fs';

import StyleDictionary from 'style-dictionary';
import type {
  Config,
  TransformedToken,
  Named,
  FileHeader,
} from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';

import {
  sizePx,
  nameKebab,
  nameKebabUnderscore,
  typographyShorthand,
  fluidFontSize,
  calc,
  fontScaleHackFormat,
} from './transformers';
import {
  scopedReferenceVariables,
  groupedTokens,
  setup as setupFormatters,
} from './formatters';

void registerTransforms(StyleDictionary);

type Brands = 'STAF';
type Densities = 'Default' | 'Compact';
const brands: Brands[] = ['STAF'];
const prefix = 'fds';
const basePxFontSize = 16;
const fileheader: Named<{ fileHeader: FileHeader }> = {
  name: 'fileheader',
  fileHeader: () => [
    'Do not edit directly',
    `These files are generated from design tokens defined in Figma using Token Studio`,
  ],
};

const storefrontTokensPath = '../../storefront/tokens';
const packageTokensPath = 'brand';

setupFormatters('./../../prettier.config.js');

StyleDictionary.registerTransform(sizePx);
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
    nameKebab.name,
    'ts/resolveMath',
    fluidFontSize.name,
    calc.name,
    typographyShorthand.name,
    'ts/size/lineheight',
    'ts/shadow/css/shorthand',
    sizePx.name,
    'ts/color/css/hexrgba',
  ],
});
StyleDictionary.registerTransformGroup({
  name: 'fds/js',
  transforms: [
    nameKebabUnderscore.name,
    'ts/resolveMath',
    typographyShorthand.name,
    'ts/size/px',
    'ts/size/lineheight',
    'ts/shadow/css/shorthand',
    'ts/color/css/hexrgba',
  ],
});

const baseConfig = (brand: Brands, density: Densities): Partial<Config> => {
  const tokensPath = '../../design-tokens';

  return {
    include: [
      `${tokensPath}/Base/Semantic.json`,
      `${tokensPath}/Brand/${brand}.json`,
      `${tokensPath}/Density/${density}.json`,
    ],
    source: [`${tokensPath}/Base/Core.json`],
  };
};

const excludeSource = (token: TransformedToken) =>
  !token.filePath.includes('Core.json');

const getTokensPackageConfig = (
  brand: Brands,
  targetFolder = '',
  density: Densities = 'Default',
): Config => {
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
    ...baseConfig(brand, density),
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
            ['spacing', 'sizing'].includes(token.type as string),
          // outputReferences: true,
        },
      },
      js: {
        basePxFontSize,
        transformGroup: 'fds/js',
        files: [
          {
            destination: `${destinationPath}/tokens.cjs.js`,
            format: 'javascript/module-flat',
            filter: excludeSource,
          },
          {
            destination: `${destinationPath}/tokens.esm.js`,
            format: 'javascript/es6',
            filter: excludeSource,
          },
          {
            destination: `${destinationPath}/tokens.d.ts`,
            format: 'typescript/es6-declarations',
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

const getStorefrontConfig = (
  brand: Brands,
  targetFolder = '',
  density: Densities = 'Default',
): Config => {
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
    ...baseConfig(brand, density),
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

console.log('🏗️  Started building package tokens…');

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

const indexFile = brands
  .map((brand) => {
    const brandName = brand.toLocaleLowerCase();
    return `export * as ${brandName} from './${brandName}';`;
  })
  .join('\n');

fs.writeFileSync(`${storefrontTokensPath}/index.ts`, `${indexFile}\n`);

console.log('\n---------------------------------------');

console.log('\n🏁 Finished building storefront tokens!');
