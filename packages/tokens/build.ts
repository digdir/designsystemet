import { noCase } from 'change-case';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';

void registerTransforms(StyleDictionary);

type Brands = 'Altinn' | 'Digdir' | 'Tilsynet';
const brands: Brands[] = ['Digdir', 'Tilsynet', 'Altinn'];
const prefix = 'fds';
const basePxFontSize = 16;
/**
 * Transforms `level1.level2.another_level` to `level1-level2-another_level`
 * This maintains hierarchy distinction (i.e. underscore is not a hierarchy level separator)
 */
StyleDictionary.registerTransform({
  name: 'name/cti/hierarchical-kebab',
  type: 'name',
  transformer: (token, options) => {
    return noCase([options?.prefix].concat(token.path).join('-'), {
      delimiter: '-',
      stripRegexp: /[^A-Z0-9_]+/gi,
    });
  },
});

type Typgraphy = {
  fontWeight: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
};

StyleDictionary.registerTransform({
  name: 'typography/shorthand',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'typography',
  transformer: (token, options) => {
    const value = token.value as Typgraphy;
    const divider = options?.basePxFontSize || 1;
    const remValue = value.fontSize / divider;
    return `${value.fontWeight} ${remValue}rem/${value.lineHeight} '${value.fontFamily}'`;
  },
});

const excludeSource = (token: TransformedToken) =>
  !token.filePath.includes('Core.json');

const getStyleDictionaryConfig = (
  brand: Brands,
  targetFolder = 'dist',
): Config => {
  const tokensPath = '../../design-tokens';
  const destinationPath = `${targetFolder}/${brand.toLowerCase()}`;

  return {
    include: [
      `${tokensPath}/Brand/${brand}.json`,
      `${tokensPath}/Base/Semantic.json`,
    ],
    source: [`${tokensPath}/Base/Core.json`],
    platforms: {
      js: {
        basePxFontSize,
        transforms: [
          'ts/resolveMath',
          'name/cti/camel',
          'typography/shorthand',
          'ts/resolveMath',
          'ts/size/lineheight',
          'ts/shadow/css/shorthand',
        ],
        transformGroup: 'js',
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
      },
      css: {
        prefix,
        basePxFontSize,
        transforms: [
          'ts/resolveMath',
          'name/cti/hierarchical-kebab',
          'typography/shorthand',
          'ts/resolveMath',
          'ts/size/lineheight',
          'ts/shadow/css/shorthand',
        ],
        files: [
          {
            destination: `${destinationPath}/tokens.css`,
            format: 'css/variables',
            filter: excludeSource,
          },
        ],
      },
    },
  };
};

console.log('Build started...');

brands.map((brand) => {
  console.log('\n==============================================');
  console.log(`\nProcessing: ${brand}`);

  const extendedStyleDictionary = StyleDictionary.extend(
    getStyleDictionaryConfig(brand, 'dist'),
  );

  extendedStyleDictionary.buildAllPlatforms();

  console.log('\nEnd processing');
});

console.log('\n==============================================');
console.log('\nBuild completed!');
