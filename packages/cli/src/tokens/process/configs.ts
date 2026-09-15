import { register } from '@tokens-studio/sd-transforms';
import * as R from 'ramda';
import StyleDictionary, { type Tokens } from 'style-dictionary';
import type { DesignTokens } from 'style-dictionary/types';
import type { GetSDConfigOptions, SDConfigForThemePermutation, ThemeDimension } from '../types.ts';
import { traverseObj } from '../utils.ts';
import { colorSchemeVariables, colorVariables } from './configs/color.ts';
import { semanticVariables } from './configs/semantic.ts';
import type { GetStyleDictionaryConfig } from './configs/shared.ts';
import { sizeVariables } from './configs/size.ts';
import { sizeModeVariables } from './configs/size-mode.ts';
import { typeScaleVariables } from './configs/type-scale.ts';
import { typographyVariables } from './configs/typography.ts';
import { formats } from './formats/css.ts';
import { buildOptions } from './platform.ts';
import { resolveMath, sizeRem, typographyName, unitless } from './transformers.ts';
import { getMultidimensionalThemes, type ProcessedThemeObject } from './utils/getMultidimensionalThemes.ts';

void register(StyleDictionary, { withSDBuiltins: false });

StyleDictionary.registerTransform(sizeRem);
StyleDictionary.registerTransform(typographyName);
StyleDictionary.registerTransform(resolveMath);
StyleDictionary.registerTransform(unitless);

for (const format of Object.values(formats)) {
  StyleDictionary.registerFormat(format);
}

export const configs = {
  colorSchemeVariables,
  colorVariables,
  sizeModeVariables,
  sizeVariables,
  typographyVariables,
  typeScaleVariables,
  semanticVariables,
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
