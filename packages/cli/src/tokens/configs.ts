import * as tokenStudio from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import * as R from 'ramda';
import type { ThemeObject } from '@tokens-studio/types';

import { nameKebab, typographyShorthand, sizeRem } from './transformers.js';
import { storefrontFormat } from './formats/js-tokens.js';
import { colormodeFormat } from './formats/css-variables.js';
import { typographyFormat } from './formats/css-classes.js';
import { makeEntryFile } from './actions.js';

void tokenStudio.registerTransforms(StyleDictionary);

const prefix = 'ds';
const basePxFontSize = 16;
const separator = '_';

const fileHeader = () => [`These files are generated from design tokens defind using Token Studio`];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(typographyShorthand);

StyleDictionary.registerFormat(storefrontFormat);
StyleDictionary.registerFormat(colormodeFormat);
StyleDictionary.registerFormat(typographyFormat);

StyleDictionary.registerAction(makeEntryFile);

StyleDictionary.registerTransformGroup({
  name: 'fds/css',
  transforms: [
    `ts/resolveMath`,
    'ts/typography/fontWeight',
    nameKebab.name,
    sizeRem.name,
    typographyShorthand.name,
    'ts/color/modifiers',
    'ts/color/css/hexrgba',
    'ts/size/lineheight',
    'ts/size/px',
    'ts/shadow/css/shorthand',
  ],
});

const processThemeName = R.pipe(R.replace(`${separator}semantic`, ''), R.toLower, R.split(separator));

export const permutateThemes = ($themes: ThemeObject[]) =>
  tokenStudio.permutateThemes($themes, {
    separator,
  }) as Record<string, string[]>;

type GetConfig = (options: {
  mode?: string;
  theme?: string;
  semantic?: string;
  fontSize?: string;
  typography?: string;
  outPath?: string;
}) => Config;

export const tokensConfig: GetConfig = ({ mode = 'light', outPath, theme }) => {
  return {
    log: { verbosity: 'verbose' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        mode,
        fileName: mode,
        folderName: theme,
        basePxFontSize,
        //
        prefix,
        buildPath: `${outPath}/${theme}/`,
        transformGroup: 'fds/css',
        actions: [makeEntryFile.name],
        files: [
          {
            destination: `color-modes/${mode}.css`,
            format: colormodeFormat.name,
          },
        ],
        options: {
          fileHeader,
          includeReferences: (token: TransformedToken) => {
            if (
              R.test(/accent|neutral|brand1|brand2|brand3|success|danger|warning/, token.name) &&
              R.includes('semantic/color', token.filePath)
            ) {
              return true;
            }

            return false;
          },
        },
      },
    },
  };
};

export const previewConfig: GetConfig = ({ mode = 'unknown', outPath, theme }) => {
  return {
    preprocessors: ['tokens-studio'],
    platforms: {
      storefront: {
        prefix,
        basePxFontSize,
        transformGroup: 'fds/css',
        buildPath: `${outPath}/${theme}/`,
        files: [
          {
            destination: `${mode}.ts`,
            format: storefrontFormat.name,
            filter: (token: TransformedToken) => {
              if (
                R.test(/accent|neutral|brand1|brand2|brand3|success|danger|warning/, token.name) ||
                R.includes('semantic', token.filePath)
              ) {
                return true;
              }

              return false;
            },
          },
        ],
        options: {
          fileHeader,
        },
      },
    },
  };
};

export const typographyConfig: GetConfig = ({ outPath, theme, typography }) => {
  return {
    log: { verbosity: 'verbose' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        prefix,
        typography,
        buildPath: `${outPath}/${theme}/`,
        basePxFontSize,
        transforms: [nameKebab.name, 'ts/size/lineheight', 'ts/size/px', 'ts/typography/fontWeight'],
        files: [
          {
            destination: `typography/${typography}.css`,
            format: typographyFormat.name,
            filter: (token) => token.type === 'typography',
          },
        ],
        options: {
          fileHeader,
        },
      },
    },
  };
};

export const getConfigs = (
  getConfig: GetConfig,
  outPath: string,
  tokensDir: string,
  themes: Record<string, string[]>,
) =>
  Object.entries(themes)
    .map(([name, tokensets]) => {
      const setsWithPaths = tokensets.map((x) => `${tokensDir}/${x}.json`);

      const [mode, theme, semantic, fontSize, typography] = processThemeName(name);

      console.log({ mode, theme, semantic, fontSize, typography });

      const paritionPrimitives = /(?!.*global\.json).*primitives.*/;
      const [source, include] = R.partition(R.test(paritionPrimitives), setsWithPaths);

      const config_ = getConfig({
        outPath,
        theme,
        mode,
        semantic,
        fontSize,
        typography,
      });

      const config = {
        ...config_,
        source,
        include,
      };

      // console.log(config);

      return [name, config];
    })
    .sort();
