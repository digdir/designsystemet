import { noCase } from 'change-case';
import StyleDictionary from 'style-dictionary';
import type {
  Config,
  TransformedToken,
  TransformedTokens,
} from 'style-dictionary';
import {
  registerTransforms,
  transformDimension,
} from '@tokens-studio/sd-transforms';

const { fileHeader, createPropertyFormatter } = StyleDictionary.formatHelpers;

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

StyleDictionary.registerTransform({
  name: 'name/cti/camel_underscore',
  type: 'name',
  transformer: function (token, options) {
    return noCase([options?.prefix].concat(token.path).join(' '), {
      delimiter: '_',
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
  name: 'css/fontSizes/fluid',
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
      const fontR = (parseFloat(r.value as string) / baseFontPx).toFixed(2);
      const fontV = parseFloat(v.value as string).toFixed(2);

      const fluid = `clamp(${minRem}rem, calc(${fontV}vw + ${fontR}rem), ${maxRem}rem)`;

      return fluid;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return token.value;
  },
});

StyleDictionary.registerTransform({
  name: 'css/spacing/fluid',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'spacing' && token.path[0] === 'spacing',
  transformer: (token) => {
    const value = token.value as string;

    return `calc(${value})`;
  },
});

StyleDictionary.registerTransform({
  name: 'fds/size/px',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'sizing',
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  transformer: (token) => transformDimension(token.value),
});

StyleDictionary.registerFormat({
  name: 'global-values-hack',
  formatter: ({ dictionary }) => {
    console.info('\x1b[34m✔ Setting global values');
    fontScale = dictionary.tokens['font-scale'];

    return `/** Style Dictionary hack because it must write to file for some reason... */\n`;
  },
});

StyleDictionary.registerFileHeader({
  name: 'fileheader',
  fileHeader: () => [
    'Do not edit directly',
    `These files are generated from design tokens defined in Figma using Token Studio`,
  ],
});

type ReferencesFilter = (token: TransformedToken) => boolean;

/**
 *  CSS variables format with option to include source references for matched token through `options.referencesFilter`
 */
StyleDictionary.registerFormat({
  name: 'css/variables-scoped-references',
  formatter: function ({ dictionary, options, file }) {
    const { outputReferences } = options;
    const includeReferences = options.referencesFilter as ReferencesFilter;
    let referencedTokens: TransformedToken[] = [];

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const formatWithReference = createPropertyFormatter({
      outputReferences: true,
      dictionary,
      format: 'css',
    });

    const tokens = dictionary.allTokens
      .map((token) => {
        if (
          dictionary.usesReference(token.original.value) &&
          includeReferences(token)
        ) {
          const refs = dictionary.getReferences(token.original.value);

          referencedTokens = [
            ...referencedTokens,
            ...refs.filter((x) => x.isSource),
          ];

          return formatWithReference(token);
        }

        return !token.isSource && format(token);
      })
      .filter((x) => x);

    const referenceTokens = referencedTokens
      .reduce<{ name: string; formatted: string }[]>((acc, token) => {
        if (acc.find((x) => x.name === token.name)) {
          return acc;
        }

        return [...acc, { name: token.name, formatted: format(token) }];
      }, [])
      .map((x) => x.formatted)
      .filter((x) => x);

    return (
      fileHeader({ file }) +
      ':root {\n' +
      '  /** Referenced source tokens */ \n' +
      referenceTokens.join('\n') +
      '\n\n  /** Tokens */ \n' +
      tokens.join('\n') +
      '\n}\n'
    );
  },
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
          'fds/size/px',
          'css/fontSizes/fluid',
          'css/spacing/fluid',
          'typography/shorthand',
          'ts/size/lineheight',
          'ts/shadow/css/shorthand',
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
            token.type === 'spacing',
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
