import path from 'path';

import StyleDictionary from 'style-dictionary';
import type {
  Config,
  TransformedToken,
  Named,
  FileHeader,
} from 'style-dictionary';
import {
  registerTransforms,
  checkAndEvaluateMath,
  transformColorModifiers,
  transformHEXRGBaForCSS,
  transformLineHeight,
  transformShadowForCSS,
} from '@tokens-studio/sd-transforms';

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

// File name under design-tokens/Brand
const brands = ['Digdir', 'Tilsynet', 'Altinn', 'Brreg'] as const;
type Brands = (typeof brands)[number];

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
const packageTokensPath = 'brand';

setupFormatters('./../../prettier.config.js');

StyleDictionary.registerTransform(sizePx);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(nameKebabUnderscore);
StyleDictionary.registerTransform(typographyShorthand);
StyleDictionary.registerTransform(fluidFontSize);
StyleDictionary.registerTransform(calc);

StyleDictionary.registerTransform({
  name: 'ts/resolveMath',
  type: 'value',
  transitive: true,
  matcher: (token) => typeof (token.$value ?? token.value) === 'string',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  transformer: (token) => checkAndEvaluateMath(token.$value ?? token.value),
});

StyleDictionary.registerTransform({
  name: 'ts/color/modifiers',
  type: 'value',
  transitive: true,
  matcher: (token) =>
    (token.$type ?? token.type) === 'color' &&
    token.$extensions &&
    token.$extensions['studio.tokens']?.modify,
  transformer: (token) =>
    transformColorModifiers(token, transformOpts?.['ts/color/modifiers']),
});

StyleDictionary.registerTransform({
  name: 'ts/color/css/hexrgba',
  type: 'value',
  transitive: true,
  matcher: (token) => (token.$type ?? token.type) === 'color',
  transformer: (token) => transformHEXRGBaForCSS(token.$value ?? token.value),
});

StyleDictionary.registerTransform({
  name: 'ts/size/lineheight',
  type: 'value',
  matcher: (token) => (token.$type ?? token.type) === 'lineHeights',
  transformer: (token) => transformLineHeight(token.$value ?? token.value),
});

StyleDictionary.registerTransform({
  name: 'ts/shadow/css/shorthand',
  type: 'value',
  transitive: true,
  matcher: (token) => {
    const type = token.$type ?? token.type;
    return typeof type === 'string' && ['boxShadow'].includes(type);
  },
  transformer: (token) => {
    const val = token.$value ?? token.value;
    return Array.isArray(val)
      ? val.map((single) => transformShadowForCSS(single)).join(', ')
      : transformShadowForCSS(val);
  },
});

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
    typographyShorthand.name,
    'ts/size/lineheight',
    'ts/shadow/css/shorthand',
    sizePx.name,
    'ts/color/modifiers',
    'ts/color/css/hexrgba',
    calc.name,
  ],
});

const baseConfig = (brand: Brands): Partial<Config> => {
  const tokensPath = '../../design-tokens';

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

const getTokensPackageConfig = (brand: Brands, targetFolder = ''): Config => {
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
        // transformGroup: 'fds/css',
        transformGroup: 'tokens-studio',
        files: [
          {
            destination: `${destinationPath}/tokens.css`,
            // format: 'css/variables-scoped-references',
            format: 'css/variables',
            // filter: excludeSource,
          },
        ],
        options: {
          fileHeader: fileheader.name,
          referencesFilter: (token: TransformedToken) =>
            !(token.path[0] === 'viewport') &&
            ['spacing', 'sizing', 'color'].includes(token.type as string),
          // outputReferences: true,
        },
      },
    },
  };
};

const getStorefrontConfig = (brand: Brands, targetFolder = ''): Config => {
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

  // const storefrontSD = StyleDictionary.extend(
  //   getStorefrontConfig(brand, storefrontTokensPath),
  // );

  // storefrontSD.buildAllPlatforms();
});

console.log('\n---------------------------------------');

console.log('\n🏁 Finished building storefront tokens!');
