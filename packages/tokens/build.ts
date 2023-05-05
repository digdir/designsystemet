import { noCase } from 'change-case';
import StyleDictionary from 'style-dictionary';
import type {
  Config,
  TransformedToken,
  TransformedTokens,
} from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';

void registerTransforms(StyleDictionary);

type Brands = 'Altinn' | 'Digdir' | 'Tilsynet';
const brands: Brands[] = ['Digdir', 'Tilsynet', 'Altinn'];
const prefix = 'fds';
const basePxFontSize = 16;
let fontScale: TransformedTokens;

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
  fontSize: string;
  lineHeight: number;
  fontFamily: string;
};

StyleDictionary.registerTransform({
  name: 'typography/shorthand',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'typography',
  transformer: (token, options) => {
    const typography = token.value as Typgraphy;
    let fontSize = typography.fontSize;

    if (!fontSize.startsWith('clamp')) {
      const baseFontPx = options?.basePxFontSize || 1;
      fontSize = `${parseFloat(fontSize) / baseFontPx}rem`;
    }
    return `${typography.fontWeight} ${fontSize}/${typography.lineHeight} '${typography.fontFamily}'`;
  },
});

type FontScale = {
  min: TransformedToken;
  max: TransformedToken;
  v: TransformedToken;
  r: TransformedToken;
  fluid: TransformedToken;
};

StyleDictionary.registerTransform({
  name: 'fontSizes/fluid',
  type: 'value',
  transitive: true,
  matcher: (token) =>
    token.type === 'fontSizes' &&
    token.path[0] === 'font-size' &&
    token.path[1].startsWith('f'),
  transformer: (token, options) => {
    if (fontScale) {
      const baseFontPx = options?.basePxFontSize || 1;

      const scale = fontScale[token.path[1]] as unknown as FontScale;

      const { min, max, v, r } = scale;
      const minRem = (parseFloat(min.value as string) / baseFontPx).toFixed(2);
      const maxRem = (parseFloat(max.value as string) / baseFontPx).toFixed(2);
      const fontV = parseFloat(v.value as string).toFixed(2);
      const fontR = (parseFloat(r.value as string) / baseFontPx).toFixed(2);

      const fluid = `clamp(${minRem}rem, calc(${fontV}vw + ${fontR}rem), ${maxRem}rem)`;

      return fluid;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return token.value;
  },
});

StyleDictionary.registerFormat({
  name: 'global-values-hack',
  formatter: ({ dictionary }) => {
    console.info('\x1b[34m✔ Setting global values');
    fontScale = dictionary.tokens['font-scale'];

    return `/** Style Dictionary hack because it must write to file for some reason... */\n`;
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

  const config: Config = {
    include: [
      `${tokensPath}/Brand/${brand}.json`,
      `${tokensPath}/Base/Semantic.json`,
    ],
    source: [`${tokensPath}/Base/Core.json`],
    platforms: {
      js: {
        basePxFontSize,
        transformGroup: 'js',
        transforms: [
          'ts/resolveMath',
          'name/cti/camel',
          'typography/shorthand',
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
      },
      css: {
        prefix,
        basePxFontSize,
        transformGroup: 'css',
        transforms: [
          'ts/resolveMath',
          'name/cti/hierarchical-kebab',
          'fontSizes/fluid',
          'typography/shorthand',
          'ts/size/lineheight',
          'ts/shadow/css/shorthand',
        ],
        files: [
          {
            format: 'global-values-hack',
            destination: 'ignore/hack',
          },
          {
            destination: `${destinationPath}/tokens.css`,
            format: 'css/variables',
            filter: excludeSource,
          },
        ],
        options: {
          // outputReferences: true,
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
    getStyleDictionaryConfig(brand, 'dist'),
  );

  extendedStyleDictionary.buildAllPlatforms();

  console.log('\nEnd processing');
});

console.log('\n==============================================');
console.log('\nBuild completed!');
