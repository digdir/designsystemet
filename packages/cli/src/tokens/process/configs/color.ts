import type { Config as StyleDictionaryConfig } from 'style-dictionary/types';
import { isSemanticColorToken, pathStartsWithOneOf } from '../../utils.js';
import { formats } from '../formats/css.js';
import { buildOptions } from '../platform.js';

import { dsTransformers, type GetStyleDictionaryConfig, prefix } from './shared.js';

export const colorSchemeVariables: GetStyleDictionaryConfig = ({ 'color-scheme': colorScheme = 'light', theme }) => {
  const selector = `${colorScheme === 'light' ? ':root, ' : ''}[data-color-scheme="${colorScheme}"]`;
  const layer = `ds.theme.color-scheme.${colorScheme}`;

  return {
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        colorScheme,
        theme,
        selector,
        layer,
        //
        prefix,
        buildPath: `${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `color-scheme/${colorScheme}.css`,
            format: formats.colorScheme.name,
            filter: (token) => pathStartsWithOneOf(['color'], token),
          },
        ],
        options: {
          outputReferences: false,
        },
      },
    },
  };
};

export const colorVariables: GetStyleDictionaryConfig = ({ 'color-scheme': colorScheme, theme, ...permutation }) => {
  const color = permutation.color;

  const layer = `ds.theme.color`;
  const isRootColor = color === buildOptions?.defaultColor;
  const selector = isRootColor
    ? `:root, [data-color-scheme], [data-color="${color}"]`
    : `[data-color="${color}"], [data-color-scheme][data-color="${color}"]`;

  const config: StyleDictionaryConfig = {
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        colorScheme,
        theme,
        selector,
        layer,
        //
        prefix,
        buildPath: `${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `color/${color}.css`,
            format: formats.colorCategory.name,
            filter: (token) => isSemanticColorToken(token, color),
          },
        ],
        options: {
          outputReferences: true,
        },
      },
    },
  };

  return config;
};
