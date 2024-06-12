import * as tokenStudio from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { outputReferencesFilter } from 'style-dictionary/utils';
import type { Config, TransformedToken } from 'style-dictionary/types';
import * as R from 'ramda';
import type { ThemeObject } from '@tokens-studio/types';

import { permutateThemes as permutateThemes_ } from './permutateThemes';
import { nameKebab, typographyShorthand, sizeRem } from './transformers.js';
import { jsTokens } from './formats/js-tokens.js';
import { cssVariables } from './formats/css-variables.js';
import { cssClassesTypography } from './formats/css-classes';
import { makeEntryFile } from './actions.js';

void tokenStudio.registerTransforms(StyleDictionary);

const prefix = 'ds';
const basePxFontSize = 16;
const separator = '_';

const fileHeader = () => [`These files are generated from design tokens defind using Token Studio`];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(typographyShorthand);

StyleDictionary.registerFormat(jsTokens);
StyleDictionary.registerFormat(cssVariables);
StyleDictionary.registerFormat(cssClassesTypography);

StyleDictionary.registerAction(makeEntryFile);

const dsTransformers = [
  nameKebab.name,
  `ts/resolveMath`,
  'ts/size/px',
  sizeRem.name,
  'ts/typography/fontWeight',
  typographyShorthand.name,
  'ts/color/modifiers',
  'ts/color/css/hexrgba',
  'ts/size/lineheight',
  'ts/shadow/css/shorthand',
];

const processThemeName = R.pipe(R.replace(`${separator}semantic`, ''), R.toLower, R.split(separator));

const outputColorReferences = (token: TransformedToken) => {
  if (
    R.test(/accent|neutral|brand1|brand2|brand3|success|danger|warning/, token.name) &&
    R.includes('semantic/color', token.filePath)
  ) {
    return true;
  }

  return false;
};

export const permutateThemes = ($themes: ThemeObject[]) =>
  permutateThemes_($themes, {
    separator,
  });

type GetConfig = (options: {
  mode?: string;
  theme?: string;
  semantic?: string;
  fontSize?: string;
  typography?: string;
  outPath?: string;
}) => Config;

export const cssVariablesConfig: GetConfig = ({ mode = 'light', outPath, theme }) => {
  const selector = `${mode === 'light' ? ':root, ' : ''}[data-ds-color-mode="${mode}"]`;

  const baseTypes = ['spacing', 'sizing', 'borderRadius'];

  return {
    log: { verbosity: 'silent' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        mode,
        theme,
        basePxFontSize,
        selector,
        baseTypes,
        //
        prefix,
        buildPath: `${outPath}/${theme}/`,
        transforms: dsTransformers,
        actions: [makeEntryFile.name],
        files: [
          {
            destination: `${mode}.css`,
            format: cssVariables.name,
            filter: (token, options) => {
              const { usesDtcg } = options;
              const type = (usesDtcg ? token.$type : token.type) || '';

              return !token.isSource || baseTypes.includes(type);
            },
          },
        ],
        options: {
          fileHeader,
          outputReferences: (token, options) => {
            const { usesDtcg } = options;
            const type = (usesDtcg ? token.$type : token.type) || '';

            const isBaseType = baseTypes.includes(type);
            const isInterestedColor = outputColorReferences(token);

            return (isInterestedColor || isBaseType) && outputReferencesFilter(token, options);
          },
        },
      },
    },
  };
};

export const tsTokensConfig: GetConfig = ({ mode = 'unknown', outPath, theme }) => {
  return {
    log: { verbosity: 'silent' },
    preprocessors: ['tokens-studio'],
    platforms: {
      ts: {
        prefix,
        basePxFontSize,
        transforms: dsTransformers,
        buildPath: `${outPath}/${theme}/`,
        files: [
          {
            destination: `${mode}.ts`,
            format: jsTokens.name,
            outputReferences: outputColorReferences,
            filter: (token: TransformedToken) => {
              if (R.test(/primitives\/colors|\/themes/, token.filePath)) {
                return false;
              }

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

export const cssTypographyConfig: GetConfig = ({ outPath, theme, typography }) => {
  // const selector = `${typography === 'default' ? ':root, ' : ''}[data-ds-typography="${typography}"]`;

  return {
    log: { verbosity: 'silent' },
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        prefix,
        typography,
        // selector,
        buildPath: `${outPath}/${theme}/`,
        basePxFontSize,
        transforms: [nameKebab.name, 'ts/size/lineheight', 'ts/size/px', 'ts/typography/fontWeight'],
        files: [
          {
            destination: `typography.css`,
            format: cssClassesTypography.name,
            filter: (token) => ['typography', 'fontWeights'].includes(token.type as string),
            outputColorReferences: (token: TransformedToken) => {
              const type = token.$type ?? token.type;

              if (type === 'fontWeights') {
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

type getConfigs = (
  getConfig: GetConfig,
  outPath: string,
  tokensDir: string,
  themes: Record<string, string[]>,
) => { name: string; config: Config }[];

export const getConfigs: getConfigs = (getConfig, outPath, tokensDir, themes) =>
  Object.entries(themes)
    .map(([name, tokensets]) => {
      const setsWithPaths = tokensets.map((x) => `${tokensDir}/${x}.json`);

      const [mode, theme, semantic, fontSize, typography] = processThemeName(name);

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

      return { name: `${theme}-${mode}`, config };
    })
    .sort();
