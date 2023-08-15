import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary';
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
import { scopedReferenceVariables, storefront } from './formatters';

void registerTransforms(StyleDictionary);

type Brands = 'Altinn' | 'Digdir' | 'Tilsynet' | 'Brreg';
const brands: Brands[] = ['Digdir', 'Tilsynet', 'Altinn', 'Brreg'];
const prefix = 'fds';
const basePxFontSize = 16;

StyleDictionary.registerTransform(sizePx);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(nameKebabUnderscore);
StyleDictionary.registerTransform(typographyShorthand);
StyleDictionary.registerTransform(fluidFontSize);
StyleDictionary.registerTransform(calc);

StyleDictionary.registerFormat(fontScaleHackFormat);
StyleDictionary.registerFormat(scopedReferenceVariables);
StyleDictionary.registerFormat(storefront);

StyleDictionary.registerFileHeader({
  name: 'fileheader',
  fileHeader: () => [
    'Do not edit directly',
    `These files are generated from design tokens defined in Figma using Token Studio`,
  ],
});

const excludeSource = (token: TransformedToken) =>
  !token.filePath.includes('Core.json');

const getStyleDictionaryConfig = (brand: Brands, targetFolder = ''): Config => {
  const tokensPath = '../../design-tokens';
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  const config: Config = {
    include: [
      `${tokensPath}/Brand/${brand}.json`,
      `${tokensPath}/Base/Semantic.json`,
      `${tokensPath}/Density/Default.json`,
    ],
    source: [`${tokensPath}/Base/Core.json`],
    platforms: {
      hack: {
        prefix,
        basePxFontSize,
        transforms: ['ts/resolveMath', 'name/cti/hierarchical-kebab'],
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
        transformGroup: 'css',
        transforms: [
          'name/cti/hierarchical-kebab',
          'ts/resolveMath',
          'css/fontSizes/fluid',
          'fds/calc',
          'typography/shorthand',
          'ts/size/lineheight',
          'ts/shadow/css/shorthand',
          'fds/size/px',
        ],
        files: [
          {
            destination: `${destinationPath}/tokens.css`,
            format: 'css/variables-scoped-references',
            // filter: excludeSource,
          },
        ],
        options: {
          fileHeader: 'fileheader',
          referencesFilter: (token: TransformedToken) =>
            !(token.path[0] === 'viewport') &&
            ['spacing', 'sizing'].includes(token.type as string),
          // outputReferences: true,
        },
      },
      js: {
        basePxFontSize,
        transformGroup: 'js',
        transforms: [
          'name/cti/camel_underscore',
          'ts/resolveMath',
          'typography/shorthand',
          'ts/size/px',
          'ts/size/lineheight',
          'ts/shadow/css/shorthand',
        ],
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
          fileHeader: 'fileheader',
        },
      },
      storefront: {
        prefix,
        basePxFontSize,
        transformGroup: 'css',
        transforms: [
          'name/cti/hierarchical-kebab',
          'ts/resolveMath',
          'css/fontSizes/fluid',
          'fds/calc',
          'typography/shorthand',
          'ts/size/lineheight',
          'ts/shadow/css/shorthand',
          'fds/size/px',
        ],
        files: [
          {
            destination: `../../storefront/tokens/tokens.ts`,
            format: 'storefront',
            filter: excludeSource,
          },
        ],
        options: {
          fileHeader: 'fileheader',
        },
      },
    },
  };

  return config;
};

console.log('Build started...');

brands.map((brand) => {
  console.log('\n==============================================');
  console.log(`\nProcessing: ${brand}`);

  const extendedStyleDictionary = StyleDictionary.extend(
    getStyleDictionaryConfig(brand, 'brand'),
  );

  extendedStyleDictionary.buildAllPlatforms();

  console.log('\nEnd processing');
});

console.log('\n==============================================');
console.log('\nBuild completed!');
