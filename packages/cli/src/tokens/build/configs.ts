import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';
import type { Config as StyleDictionaryConfig, TransformedToken } from 'style-dictionary/types';
import { outputReferencesFilter } from 'style-dictionary/utils';

import { buildOptions } from '../build.js';
import * as formats from './formats/css.js';
import { jsTokens } from './formats/js-tokens.js';
import { nameKebab, resolveMath, sizeRem, typographyName } from './transformers.js';
import type {
  GetSdConfigOptions,
  IsCalculatedToken,
  SDConfigForThemePermutation,
  ThemeDimension,
  ThemePermutation,
} from './types.js';
import { type ProcessedThemeObject, getMultidimensionalThemes } from './utils/getMultidimensionalThemes.js';
import { pathStartsWithOneOf, typeEquals } from './utils/utils.js';

void register(StyleDictionary, { withSDBuiltins: false });
/** Use official W3C design token format
 @see https://v4.styledictionary.com/info/dtcg/
 @see https://design-tokens.github.io/community-group/format/ */
const usesDtcg = true;
export const prefix = 'ds';
export const basePxFontSize = 16;

const fileHeader = () => [`These files are generated from design tokens defind using Token Studio`];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(nameKebab);
StyleDictionary.registerTransform(typographyName);
StyleDictionary.registerTransform(resolveMath);

StyleDictionary.registerFormat(jsTokens);
StyleDictionary.registerFormat(formats.colormode);
StyleDictionary.registerFormat(formats.semantic);
StyleDictionary.registerFormat(formats.typography);

const dsTransformers = [
  nameKebab.name,
  resolveMath.name,
  'ts/size/px',
  sizeRem.name,
  'ts/typography/fontWeight',
  typographyName.name,
  'ts/color/modifiers',
  'ts/color/css/hexrgba',
  'ts/size/lineheight',
  'shadow/css/shorthand',
];

const paritionPrimitives = R.partition(R.test(/(?!.*global\.json).*primitives.*/));

const outputColorReferences = (token: TransformedToken) => {
  if (
    R.test(/accent|neutral|brand1|brand2|brand3|success|danger|warning/, token.name) &&
    R.includes('semantic/color', token.filePath)
  ) {
    return true;
  }

  return false;
};

export type GetStyleDictionaryConfig = (
  permutation: ThemePermutation,
  options: {
    outPath?: string;
  },
) => StyleDictionaryConfig;

const colorModeVariables: GetStyleDictionaryConfig = ({ mode = 'light', theme }, { outPath }) => {
  const selector = `${mode === 'light' ? ':root, ' : ''}[data-ds-color-mode="${mode}"]`;
  const layer = `ds.theme.color-mode.${mode}`;

  return {
    usesDtcg,
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        mode,
        theme,
        selector,
        layer,
        //
        prefix,
        buildPath: `${outPath}/${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `color-mode/${mode}.css`,
            format: formats.colormode.name,
            filter: (token) => !token.isSource && typeEquals('color', token),
          },
        ],
        options: {
          fileHeader,
          outputReferences: false,
        },
      },
    },
  };
};

const semanticVariables: GetStyleDictionaryConfig = ({ theme }, { outPath }) => {
  const selector = `:root`;
  const layer = `ds.theme.semantic`;

  /**
   * This is a workaround for our formatters to support transative transformers while retaining outputReference.
   *
   * This function will wrap formatted token in `calc()`
   *
   * @example  --ds-spacing-1: var(--ds-spacing-base)*1; ->  --ds-spacing-0: calc(var(--ds-spacing-base)*1);
   */
  const isCalculatedToken: IsCalculatedToken = (token: TransformedToken) =>
    pathStartsWithOneOf(['spacing', 'sizing'], token);

  return {
    usesDtcg,
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        theme,
        basePxFontSize,
        isCalculatedToken,
        selector,
        layer,
        //
        prefix,
        buildPath: `${outPath}/${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `semantic.css`,
            format: formats.semantic.name,
            filter: (token) =>
              (!token.isSource || isCalculatedToken(token)) &&
              !typeEquals(['color', 'fontWeight', 'fontFamily', 'typography'], token),
          },
        ],
        options: {
          fileHeader,
          outputReferences: (token, options) => {
            const include = pathStartsWithOneOf(['border-radius'], token);
            return (include || isCalculatedToken(token)) && outputReferencesFilter(token, options);
          },
        },
      },
    },
  };
};

const typescriptTokens: GetStyleDictionaryConfig = ({ mode, theme }, { outPath }) => {
  return {
    usesDtcg,
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
              if (R.test(/primitives\/modes|\/themes/, token.filePath)) return false;
              if (pathStartsWithOneOf(['border-width'], token)) return false;

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

const typographyVariables: GetStyleDictionaryConfig = ({ theme, typography }, { outPath }) => {
  const selector = `${typography === 'primary' ? ':root, ' : ''}[data-ds-typography="${typography}"]`;
  const layer = `ds.theme.typography.${typography}`;

  return {
    usesDtcg: true,
    preprocessors: ['tokens-studio'],
    expand: {
      include: ['typography'],
      typesMap: { ...expandTypesMap, typography: { ...expandTypesMap.typography, letterSpacing: 'dimension' } },
    },
    platforms: {
      css: {
        prefix,
        typography,
        selector,
        layer,
        buildPath: `${outPath}/${theme}/`,
        basePxFontSize,
        transforms: [
          nameKebab.name,
          'ts/size/px',
          sizeRem.name,
          'ts/size/lineheight',
          'ts/typography/fontWeight',
          typographyName.name,
        ],
        files: [
          {
            destination: `typography/${typography}.css`,
            format: formats.typography.name,
            filter: (token) => {
              const included = typeEquals(
                ['typography', 'fontweight', 'fontFamily', 'lineheight', 'fontsize', 'dimension', 'font'],
                token,
              );

              return (
                included &&
                !pathStartsWithOneOf(
                  ['spacing', 'sizing', 'border-width', 'border-radius', 'theme', 'theme2', 'theme3', 'theme4'],
                  token,
                )
              );
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

export const configs = {
  colorModeVariables,
  typographyVariables,
  semanticVariables,
  typescriptTokens,
};

export const getConfigsForThemeDimensions = (
  getConfig: GetStyleDictionaryConfig,
  themes: ProcessedThemeObject[],
  dimensions: ThemeDimension[],
  options: GetSdConfigOptions,
): SDConfigForThemePermutation[] => {
  const { outPath, tokensDir } = options;

  const permutations = getMultidimensionalThemes(themes, dimensions);
  return permutations
    .map(({ selectedTokenSets, permutation }) => {
      const setsWithPaths = selectedTokenSets.map((x) => `${tokensDir}/${x}.json`);

      const [source, include] = paritionPrimitives(setsWithPaths);

      const config_ = getConfig(permutation, { outPath });

      const config: StyleDictionaryConfig = {
        ...config_,
        log: {
          ...config_?.log,
          verbosity: buildOptions?.verbose ? 'verbose' : 'silent',
        },
        source,
        include,
      };

      return { permutation, config };
    })
    .sort();
};
