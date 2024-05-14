import path from 'path';
import fs from 'fs';

import {
  registerTransforms,
  permutateThemes,
} from '@tokens-studio/sd-transforms';
import type { ThemeObject } from '@tokens-studio/types';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import * as R from 'ramda';

import { nameKebab, typographyShorthand, sizeRem } from './transformers.js';
import { groupedTokens, scopedReferenceVariables } from './formatters.js';

void registerTransforms(StyleDictionary);

type Brand = string;

const prefix = 'fds';
const basePxFontSize = 16;

const fileHeader = () => [
  'Do not edit directly',
  `These files are generated from design tokens defined in Figma using Token Studio`,
];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(typographyShorthand);

StyleDictionary.registerFormat(groupedTokens);
StyleDictionary.registerFormat(scopedReferenceVariables);

StyleDictionary.registerTransformGroup({
  name: 'fds/css',
  transforms: [
    `ts/resolveMath`,
    nameKebab.name,
    sizeRem.name,
    typographyShorthand.name,
    'ts/color/modifiers',
    'ts/color/css/hexrgba',
    'ts/size/lineheight',
    'ts/shadow/css/shorthand',
  ],
});

const excludeSource = (token: TransformedToken) => {
  if (token.filePath.includes('core/**/*.json')) return false;

  if (token.path[0] === 'viewport' && ['color'].includes(token.type as string))
    return false;

  return true;
};

const getCSSConfig = ({
  fileName = 'unknown',
  buildPath = 'unknown',
}): Config => {
  return {
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        buildPath,
        files: [
          {
            destination: `${fileName}.css`,
            format: scopedReferenceVariables.name,
            filter: excludeSource,
          },
        ],
        options: {
          fileHeader,
          includeReferences: (token: TransformedToken) => {
            if (
              token.name.match(/accent|neutral|brand1|brand2|brand3/) &&
              token.filePath.includes('semantic/color')
            ) {
              return true;
            }

            if (token.name.match(/global/) && token.filePath.includes('core')) {
              return true;
            }

            return false;
          },
        },
      },
    },
  };
};

const getStorefrontConfig = ({
  fileName = 'unknown',
  buildPath = 'unknown',
}): Config => {
  return {
    preprocessors: ['tokens-studio'],
    platforms: {
      storefront: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        buildPath,
        files: [
          {
            destination: `${fileName}.ts`,
            format: groupedTokens.name,
            filter: excludeSource,
          },
        ],
        options: {
          fileHeader,
        },
      },
    },
  };
};

type Options = {
  /** Design tokens path  */
  tokens: string;
  /** File names of Token studio brand files located in  @type {Options['tokens']} */
  brands: string[];
};

const processThemeName = R.pipe(
  R.replace('_semantic', ''),
  R.toLower,
  R.split('_'),
);

export async function run(options: Options): Promise<void> {
  const outPath = options.tokens;

  const $themes = JSON.parse(
    fs.readFileSync(path.resolve(`${outPath}/$themes.json`), 'utf-8'),
  ) as ThemeObject[];

  const themes = permutateThemes($themes, {
    separator: '_',
  }) as Record<string, string[]>;

  // const storefrontTokensPath = path.resolve('../../apps/storefront/tokens');
  const packageTokensPath = path.resolve('../../packages/theme/brand');

  const configs = Object.entries(themes)
    .map(([name, tokensets]) => {
      const updatedSets = tokensets.map((x) =>
        path.resolve(`${outPath}/${x}.json`),
      );

      const [fileName, folderName] = processThemeName(name);

      const [source, include] = R.partition(
        R.includes('core/modes'),
        updatedSets,
      );

      const config_ = getCSSConfig({
        fileName: fileName,
        buildPath: `${packageTokensPath}/${folderName}/`,
      });

      const config = {
        ...config_,
        source: source,
        include,
      };

      return [`${folderName}: ${fileName}`, config];
    })
    .sort();

  if (configs.length > 0) {
    console.log('🍱 Staring token builder');
    console.log('➡️  Tokens path: ', outPath);

    console.log('\n🏗️  Start building CSS tokens');
    await Promise.all(
      configs.map(async ([name, config]) => {
        console.log(`👷 Processing ${name as string}`);

        const sd = new StyleDictionary();
        const tokensPackageSD = await sd.extend(config);

        return tokensPackageSD.buildAllPlatforms();
      }),
    );
    console.log('🏁 Finished building package tokens!');

    // console.log('\n🏗️  Started building storefront tokens…');
    // await Promise.all(
    //   brands.map(async (brand) => {
    //     console.log(`👷 Processing ${brand}`);

    //     const storefrontSD = new StyleDictionary(
    //       getStorefrontConfig(brand, storefrontTokensPath, tokensPath),
    //     );

    //     return storefrontSD.buildAllPlatforms();
    //   }),
    // );
    // console.log('🏁 Finished building storefront tokens!');
  }
}
