import { noCase } from 'change-case';
import StyleDictionary from 'style-dictionary';
import type {
  Config,
  TransformedToken,
  TransformedTokens,
} from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';

const { fileHeader, formattedVariables, createPropertyFormatter } =
  StyleDictionary.formatHelpers;

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
  name: 'spacing/fluid',
  type: 'value',
  transitive: true,
  matcher: (token) => token.type === 'spacing' && token.path[0] === 'spacing',
  transformer: (token) => {
    const value = token.value as string;

    return `${value}`;
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

StyleDictionary.registerFileHeader({
  name: 'fileheader',
  fileHeader: () => [
    'Do not edit directly',
    `These files are generated from design tokens defined in Figma using Token Studio`,
  ],
});

const isFluidSpacing = (token: TransformedToken) => token.type === 'spacing';

StyleDictionary.registerFormat({
  name: `es6WithReferences`,
  formatter: ({ dictionary }) => {
    return dictionary.allTokens
      .map((token) => {
        let value = JSON.stringify(token.value);
        // the `dictionary` object now has `usesReference()` and
        // `getReferences()` methods. `usesReference()` will return true if
        // the value has a reference in it. `getReferences()` will return
        // an array of references to the whole tokens so that you can access their
        // names or any other attributes.
        if (dictionary.usesReference(token.original.value)) {
          // Note: make sure to use `token.original.value` because
          // `token.value` is already resolved at this point.
          const refs = dictionary.getReferences(token.original.value);
          refs.forEach((ref) => {
            value = value.replace(ref.value as string, function () {
              return `${ref.name}`;
            });
          });
        }
        return `export const ${token.name} = ${value};`;
      })
      .join(`\n`);
  },
});

StyleDictionary.registerFormat({
  name: 'myCustomFormat',
  formatter: function ({ dictionary, options, file }) {
    const { outputReferences } = options;
    let referencedTokens: TransformedToken[] = [];
    // const filterReferences = ['font-size'];

    const defaultFormat = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const formatWithReference = createPropertyFormatter({
      outputReferences: true,
      dictionary,
      format: 'css',
    });

    const formattedTokens = dictionary.allTokens
      .map((token) => {
        if (
          dictionary.usesReference(token.original.value) &&
          isFluidSpacing(token)
        ) {
          const refs = dictionary.getReferences(token.original.value);
          referencedTokens = [...referencedTokens, ...refs];
          const formatted = formatWithReference(token);
          console.log('Custom format', { name: token.name, formatted, refs });
          return formatted;
        }

        return !token.isSource && defaultFormat(token);
      })
      .filter((x) => x);

    const formattedReferenceTokens = referencedTokens.reduce<
      TransformedToken[]
    >((acc, token) => {
      if (acc.includes(token.name)) {
        return acc;
      }

      return defaultFormat(token);
    }, []);

    return (
      fileHeader({ file }) +
      ':root {\n' +
      '  /** Referenced source tokens */ \n' +
      formattedReferenceTokens.join('\n') +
      '\n\n  /** Semantic tokens */ \n' +
      formattedTokens.join('\n') +
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
          'ts/resolveMath',
          'name/cti/hierarchical-kebab',
          'fontSizes/fluid',
          'spacing/fluid',
          'typography/shorthand',
          'ts/size/lineheight',
          'ts/shadow/css/shorthand',
        ],
        files: [
          {
            destination: `${destinationPath}/tokens.css`,
            format: 'myCustomFormat',
            // filter: excludeSource,
          },
        ],
        options: {
          fileHeader: 'fileheader',
          // outputReferences: true,
        },
      },
      js: {
        basePxFontSize,
        transformGroup: 'js',
        transforms: [
          'ts/resolveMath',
          'name/cti/camel_underscore',
          'fontSizes/fluid',
          'spacing/fluid',
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
