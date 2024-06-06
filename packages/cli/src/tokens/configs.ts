import * as tokenStudio from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import * as R from 'ramda';
import type { ThemeObject } from '@tokens-studio/types';

import { nameKebab, typographyShorthand, sizeRem } from './transformers.js';
import { groupedTokens } from './formats/groupedTokens.js';
import { scopedReferenceVariables } from './formats/scopedReferenceVariables.js';
import { typographyClasses } from './formats/typographyClasses.js';
import { makeEntryFile } from './actions.js';

void tokenStudio.registerTransforms(StyleDictionary);

const prefix = 'ds';
const basePxFontSize = 16;
const separator = '_';

const fileHeader = () => [`These files are generated from design tokens defind using Token Studio`];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(typographyShorthand);

StyleDictionary.registerFormat(groupedTokens);
StyleDictionary.registerFormat(scopedReferenceVariables);
StyleDictionary.registerFormat(typographyClasses);

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
  fileName: string;
  buildPath: string;
  mode?: string;
  outPath?: string;
  folderName?: string;
}) => Config;

export const tokensConfig: GetConfig = ({
  fileName = 'unknown',
  buildPath = 'unknown',
  mode = 'light',
  outPath,
  folderName,
}) => {
  return {
    log: { verbosity: 'verbose' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        fileName,
        folderName,
        basePxFontSize,
        //
        prefix,
        buildPath: buildPath ?? `${outPath}/${folderName}/`,
        transformGroup: 'fds/css',
        actions: [makeEntryFile.name],
        files: [
          {
            destination: `${fileName}.css`,
            format: scopedReferenceVariables.name,
          },
        ],
        options: {
          mode,
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

export const previewConfig = ({ fileName = 'unknown', buildPath = 'unknown' }): Config => {
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

export const typographyConfig: GetConfig = ({ buildPath = 'unknown', fileName }) => {
  return {
    log: { verbosity: 'verbose' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        prefix,
        buildPath,
        basePxFontSize,
        transforms: [nameKebab.name, 'ts/size/lineheight', 'ts/size/px', 'ts/typography/fontWeight'],
        files: [
          {
            destination: `typography.css`,
            format: typographyClasses.name,
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
        fileName: mode,
        outPath,
        folderName: theme,
        buildPath: `${outPath}/${theme}/`,
        mode,
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