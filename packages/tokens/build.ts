// eslint-disable-next-line @typescript-eslint/no-var-requires
import { noCase } from 'change-case';
import StyleDictionary from 'style-dictionary';
import type { Config } from 'style-dictionary';

type Brands = 'Altinn' | 'Digdir' | 'Tilsynet';
const brands: Brands[] = ['Digdir', 'Tilsynet', 'Altinn'];
const prefix = 'fds';

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

StyleDictionary.registerTransform({
  name: 'typography/shorthand',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'typography',
  transformer: (token) => {
    const { value } = token;
    return `${value.fontWeight} ${value.fontSize}/${value.lineHeight} ${value.fontFamily}`.toLowerCase();
  },
});

const fontSize = 16;
/**
 * Transform fontSizes to px
 */
StyleDictionary.registerTransform({
  name: 'size/rem',
  type: 'value',
  transitive: true,
  matcher: (token) => ['fontSizes'].includes(token.type),
  transformer: (token) => token.value / fontSize + 'rem',
});

StyleDictionary.registerFormat({
  name: 'css/classFormat',
  formatter: ({ dictionary }) => {
    return `
 ${dictionary.allProperties
   .map((prop) => {
     return `
 .${prop.name} {
     font-family: ${prop.value.fontFamily},
     font-size: ${prop.value.fontSize},
     font-weight: ${prop.value.fontWeight},
     line-height: ${prop.value.lineHeight}
 };`;
   })
   .join('\n')}
 `;
  },
});

const getStyleDictionaryConfig = (brand: Brands): Config => {
  const tokensPath = '../../design-tokens';
  const distFolder = `dist/${brand.toLowerCase()}`;
  return {
    source: [
      `${tokensPath}/Brand/${brand}.json`,
      `${tokensPath}/Base/Core.json`,
      `${tokensPath}/Base/Semantic.json`,
    ],
    platforms: {
      js: {
        transforms: ['name/cti/camel', 'typography/shorthand', 'size/rem'],
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
        prefix,
        transforms: [
          'name/cti/hierarchical-kebab',
          'typography/shorthand',
          'size/rem',
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

  const extendedStyleDictionary = StyleDictionary.extend(
    getStyleDictionaryConfig(brand),
  );

  extendedStyleDictionary.buildAllPlatforms();

  console.log('\nEnd processing');
});

console.log('\n==============================================');
console.log('\nBuild completed!');
