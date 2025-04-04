import { register } from '@tokens-studio/sd-transforms';
import * as R from 'ramda';
import StyleDictionary, { type Tokens } from 'style-dictionary';
import type { DesignTokens } from 'style-dictionary/types';
import type { GetSDConfigOptions, SDConfigForThemePermutation, ThemeDimension } from '../types.js';
import { traverseObj } from '../utils.js';
import { colorCategoryVariables, colorSchemeVariables } from './configs/color.js';
import { semanticVariables } from './configs/semantic.js';
import type { GetStyleDictionaryConfig } from './configs/shared.js';
import { typescriptTokens } from './configs/storefront.js';
import { typographyVariables } from './configs/typography.js';
import { formats } from './formats/css.js';
import { jsTokens } from './formats/js-tokens.js';
import { buildOptions } from './platform.js';
import { resolveMath, sizeRem, typographyName, unitless } from './transformers.js';
import { type ProcessedThemeObject, getMultidimensionalThemes } from './utils/getMultidimensionalThemes.js';

void register(StyleDictionary, { withSDBuiltins: false });

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(typographyName);
StyleDictionary.registerTransform(resolveMath);
StyleDictionary.registerTransform(unitless);

StyleDictionary.registerFormat(jsTokens);
for (const format of Object.values(formats)) {
  StyleDictionary.registerFormat(format);
}

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
  processed$themes: ProcessedThemeObject[],
  dimensions: ThemeDimension[],
  options: GetSDConfigOptions,
): SDConfigForThemePermutation[] => {
  const { tokensDir, tokenSets } = options;

  const permutations = getMultidimensionalThemes(processed$themes, dimensions);
  return permutations
    .flatMap(({ selectedTokenSets, permutation }) => {
      const tokenSource: { source?: string[]; tokens: Tokens } = { source: undefined, tokens: {} };

      if (tokenSets) {
        for (const tokenSet of selectedTokenSets) {
          const tokens = tokenSets.get(tokenSet);

          if (tokens) {
            const tokensWithFilePath = traverseObj(tokens as DesignTokens, (obj) => {
              if (Object.hasOwn(obj, `$value`) && !obj.filePath) {
                obj.filePath = tokenSet;
              }
            });

            // Merge tokenSets into a single tokens object with filePath denoting tokenSet
            tokenSource.tokens = R.mergeDeepRight(tokenSource.tokens, tokensWithFilePath) as DesignTokens;
          }
        }
      } else {
        // Tell SD where to read tokenSets from disk
        tokenSource.source = selectedTokenSets.map((x) => `${tokensDir}/${x}.json`);
      }

      const configOrConfigs = getConfig(permutation);
      const configs_ = Array.isArray(configOrConfigs) ? configOrConfigs : [{ config: configOrConfigs }];

      const configs: SDConfigForThemePermutation[] = configs_.map(({ config, permutationOverrides }) => {
        return {
          permutation: { ...permutation, ...permutationOverrides },
          config: {
            ...config,
            /** Use official W3C design token format
            @see https://v4.styledictionary.com/info/dtcg/
            @see https://design-tokens.github.io/community-group/format/ */
            usesDtcg: true,
            log: {
              ...config?.log,
              verbosity: buildOptions?.verbose ? 'verbose' : 'silent',
            },
            ...tokenSource,
          },
        };
      });

      return configs;
    })
    .sort();
};
