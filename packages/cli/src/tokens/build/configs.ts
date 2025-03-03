import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import * as R from 'ramda';
import StyleDictionary from 'style-dictionary';
import type { Config as StyleDictionaryConfig, TransformedToken } from 'style-dictionary/types';
import { outputReferencesFilter } from 'style-dictionary/utils';

import { buildOptions } from '../build.js';
import { isColorCategoryToken, isDigit, isSemanticToken, pathStartsWithOneOf, typeEquals } from '../utils.js';
import { formats } from './formats/css.js';
import { jsTokens } from './formats/js-tokens.js';
import { resolveMath, sizeRem, typographyName, unitless } from './transformers.js';
import type {
  ColorCategories,
  GetSdConfigOptions,
  SDConfigForThemePermutation,
  ThemeDimension,
  ThemePermutation,
} from './types.js';
import { type ProcessedThemeObject, getMultidimensionalThemes } from './utils/getMultidimensionalThemes.js';

void register(StyleDictionary, { withSDBuiltins: false });
/** Use official W3C design token format
 @see https://v4.styledictionary.com/info/dtcg/
 @see https://design-tokens.github.io/community-group/format/ */
const usesDtcg = true;
export const prefix = 'ds';
export const basePxFontSize = 16;

const fileHeader = () => [`These files are generated from design tokens defind using Token Studio`];

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(typographyName);
StyleDictionary.registerTransform(resolveMath);
StyleDictionary.registerTransform(unitless);

StyleDictionary.registerFormat(jsTokens);
for (const format of Object.values(formats)) {
  StyleDictionary.registerFormat(format);
}

const dsTransformers = [
  'name/kebab',
  resolveMath.name,
  'ts/size/px',
  sizeRem.name,
  unitless.name,
  'ts/typography/fontWeight',
  typographyName.name,
  'ts/color/modifiers',
  'ts/color/css/hexrgba',
  'ts/size/lineheight',
  'shadow/css/shorthand',
];

const paritionPrimitives = R.partition(R.test(/(?!.*global\.json).*primitives.*/));

export type GetStyleDictionaryConfig = (
  permutation: ThemePermutation,
  options: {
    outPath?: string;
  },
) => StyleDictionaryConfig | { config: StyleDictionaryConfig; permutationOverrides?: Partial<ThemePermutation> }[];

const colorSchemeVariables: GetStyleDictionaryConfig = (
  { 'color-scheme': colorScheme = 'light', theme },
  { outPath },
) => {
  const selector = `${colorScheme === 'light' ? ':root, ' : ''}[data-color-scheme="${colorScheme}"]`;
  const layer = `ds.theme.color-scheme.${colorScheme}`;

  return {
    usesDtcg,
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        colorScheme,
        theme,
        selector,
        layer,
        //
        prefix,
        buildPath: `${outPath}/${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `color-scheme/${colorScheme}.css`,
            format: formats.colorScheme.name,
            filter: (token) => !token.isSource && typeEquals('color', token) && !R.startsWith(['global'], token.path),
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

type ColorCategoryOpts = { category: ColorCategories } | { category: 'builtin'; color: string };

const colorCategoryVariables =
  (opts: ColorCategoryOpts): GetStyleDictionaryConfig =>
  ({ 'color-scheme': colorScheme, theme, ...permutation }, { outPath }) => {
    const category = opts.category;
    const color = category === 'builtin' ? opts.color : permutation[`${category}-color`];
    const layer = `ds.theme.color`;
    const isRootColor = color === buildOptions?.rootColor;
    const selector = `${isRootColor ? ':root, [data-color-scheme], ' : ''}[data-color="${color}"]`;

    const config: StyleDictionaryConfig = {
      usesDtcg,
      preprocessors: ['tokens-studio'],
      platforms: {
        css: {
          // custom
          outPath,
          colorScheme,
          theme,
          selector,
          layer,
          //
          prefix,
          buildPath: `${outPath}/${theme}/`,
          transforms: dsTransformers,
          files: [
            {
              destination: `color/${color}.css`,
              format: formats.colorCategory.name,
              filter: (token) =>
                category === 'builtin'
                  ? isSemanticToken(token) && R.startsWith(['color', color], token.path)
                  : isColorCategoryToken(token, category),
            },
          ],
          options: {
            fileHeader,
            outputReferences: true,
          },
        },
      },
    };

    return config;
  };

const semanticVariables: GetStyleDictionaryConfig = ({ theme }, { outPath }) => {
  const selector = `:root`;
  const layer = `ds.theme.semantic`;

  return {
    usesDtcg,
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        outPath,
        theme,
        basePxFontSize,
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
            filter: (token) => {
              const unwantedPaths = pathStartsWithOneOf(['font-size', 'line-height', 'letter-spacing'], token);
              const unwantedTypes = typeEquals(['color', 'fontWeight', 'fontFamily', 'typography'], token);
              const unwantedTokens = !(unwantedPaths || unwantedTypes);

              return !token.isSource && unwantedTokens;
            },
          },
        ],
        options: {
          fileHeader,
          outputReferences: (token, options) => {
            const include = pathStartsWithOneOf(['border-radius'], token);
            const isWantedSize = pathStartsWithOneOf(['size', '_size'], token) && isDigit(token.path[1]);
            return (include || isWantedSize) && outputReferencesFilter(token, options);
          },
        },
      },
    },
  };
};

const typescriptTokens: GetStyleDictionaryConfig = ({ 'color-scheme': colorScheme, theme }, { outPath }) => {
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
            destination: `${colorScheme}.ts`,
            format: jsTokens.name,
            filter: (token: TransformedToken) => {
              if (
                pathStartsWithOneOf(['border-width', 'letter-spacing', 'border-radius'], token) &&
                !R.includes('semantic', token.filePath)
              )
                return false;

              const isSemanticColor = R.includes('semantic', token.filePath) && typeEquals(['color'], token);
              const wantedTypes = typeEquals(['shadow', 'dimension', 'typography', 'opacity'], token);

              return isSemanticColor || wantedTypes;
            },
          },
        ],
        options: {
          fileHeader,
          outputReferences: (token, options) => {
            const include = pathStartsWithOneOf(['border-radius'], token);
            const isWantedSize = pathStartsWithOneOf(['size', '_size'], token) && isDigit(token.path[1]);
            return (include || isWantedSize) && outputReferencesFilter(token, options);
          },
        },
      },
    },
  };
};

const typographyVariables: GetStyleDictionaryConfig = ({ theme, typography }, { outPath }) => {
  const selector = `${typography === 'primary' ? ':root, ' : ''}[data-typography="${typography}"]`;
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
          'name/kebab',
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
                ['typography', 'fontweight', 'fontFamily', 'lineHeight', 'dimension', 'font', 'fontsize'],
                token,
              );

              // Remove primitive typgography tokens
              if (/primitives\/modes\/typography\/(primary|secondary)/.test(token.filePath)) return false;

              return (
                included &&
                !pathStartsWithOneOf(['spacing', 'sizing', 'size', '_size', 'border-width', 'border-radius'], token)
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
  colorSchemeVariables,
  mainColorVariables: colorCategoryVariables({ category: 'main' }),
  supportColorVariables: colorCategoryVariables({ category: 'support' }),
  neutralColorVariables: colorCategoryVariables({ category: 'builtin', color: 'neutral' }),
  successColorVariables: colorCategoryVariables({ category: 'builtin', color: 'success' }),
  dangerColorVariables: colorCategoryVariables({ category: 'builtin', color: 'danger' }),
  warningColorVariables: colorCategoryVariables({ category: 'builtin', color: 'warning' }),
  infoColorVariables: colorCategoryVariables({ category: 'builtin', color: 'info' }),
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
    .flatMap(({ selectedTokenSets, permutation }) => {
      const setsWithPaths = selectedTokenSets.map((x) => `${tokensDir}/${x}.json`);

      const [source, include] = paritionPrimitives(setsWithPaths);

      const configOrConfigs = getConfig(permutation, { outPath });
      const configs_ = Array.isArray(configOrConfigs) ? configOrConfigs : [{ config: configOrConfigs }];

      const configs: SDConfigForThemePermutation[] = configs_.map(({ config, permutationOverrides }) => {
        return {
          permutation: { ...permutation, ...permutationOverrides },
          config: {
            ...config,
            log: {
              ...config?.log,
              verbosity: buildOptions?.verbose ? 'verbose' : 'silent',
            },
            source,
            include,
          },
        };
      });
      return configs;
    })
    .sort();
};
