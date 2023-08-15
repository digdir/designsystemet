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
import { scopedReferenceVariables, groupedTokens } from './formatters';

void registerTransforms(StyleDictionary);

type Brands = 'Altinn' | 'Digdir' | 'Tilsynet' | 'Brreg';
const brands: Brands[] = ['Digdir', 'Tilsynet', 'Altinn', 'Brreg'];
const prefix = 'fds';
const basePxFontSize = 16;
const fileheader: Named<{ fileHeader: FileHeader }> = {
  name: 'fileheader',
  fileHeader: () => [
    'Do not edit directly',
    `These files are generated from design tokens defined in Figma using Token Studio`,
  ],
};

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
  ],
});

const excludeSource = (token: TransformedToken) =>
  !token.filePath.includes('Core.json');

const getStyleDictionaryConfig = (brand: Brands, targetFolder = ''): Config => {
  const tokensPath = '../../design-tokens';
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
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
      storefront: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        files: [
          {
            destination: `../../storefront/tokens/tokens.ts`,
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
