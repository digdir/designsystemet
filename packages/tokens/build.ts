// eslint-disable-next-line @typescript-eslint/no-var-requires
import { noCase } from 'change-case';
import { extend } from 'style-dictionary';
import type { Config } from 'style-dictionary';

type Brands = 'Altinn' | 'Digdir' | 'Tilsynet';
const brands: Brands[] = ['Digdir', 'Tilsynet'];

const getStyleDictionaryConfig = (brand: Brands): Config => {
  const tokensPath = '../../design-tokens';
  const distFolder = `dist/${brand}`;
  return {
    source: [
      `${tokensPath}/Brand/${brand}.json`,
      `${tokensPath}/Base/**/*.json`,
    ],
    transform: {
      /**
       * Transforms `level1.level2.another_level` to `level1-level2-another_level`
       * This maintains hierarchy distinction (i.e. underscore is not a hierarchy level separator)
       */
      'name/cti/hierarchical-kebab': {
        type: 'name',
        transformer: (token, options) => {
          return noCase([options?.prefix].concat(token.path).join('-'), {
            delimiter: '-',
            stripRegexp: /[^A-Z0-9_]+/gi,
          });
        },
      },
    },
    platforms: {
      js: {
        transformGroup: 'js',
        files: [
          {
            destination: `${distFolder}/tokens.cjs.js`,
            format: 'javascript/module-flat',
          },
          {
            destination: `${distFolder}/tokens.esm.js`,
            format: 'javascript/es6',
          },
          {
            destination: `${distFolder}/tokens.d.ts`,
            format: 'typescript/es6-declarations',
          },
        ],
      },
      css: {
        // `transformGroup: "css"` includes the transforms below, except for `name/cti/hierarchical-kebab`
        transforms: [
          'attribute/cti',
          'name/cti/hierarchical-kebab',
          'time/seconds',
          'content/icon',
          'size/rem',
          'color/css',
        ],
        files: [
          {
            destination: `${distFolder}/tokens.css`,
            format: 'css/variables',
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

  const StyleDictionary = extend(getStyleDictionaryConfig(brand));

  StyleDictionary.buildAllPlatforms();

  console.log('\nEnd processing');
});

console.log('\n==============================================');
console.log('\nBuild completed!');
