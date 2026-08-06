import type { Config as StyleDictionaryConfig } from 'style-dictionary/types';
import { isSemanticColorToken, pathStartsWithOneOf } from '../../utils.ts';
import { formats } from '../formats/css.ts';
import { buildOptions } from '../platform.ts';

import { dsTransformers, type GetStyleDictionaryConfig, prefix } from './shared.ts';

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
            filter: (token) => pathStartsWithOneOf(['color'], token) || token.path[1] === 'color', // link-visited tokens have "color" as the second segment of their path, e.g. "ds.color.link-visited"
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
