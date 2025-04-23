import * as R from 'ramda';
import type { Config as StyleDictionaryConfig } from 'style-dictionary/types';
import type { BuiltInColors, ColorCategories } from '../../types.js';
import { isColorCategoryToken, isSemanticColorToken, typeEquals } from '../../utils.js';
import { formats } from '../formats/css.js';
import { buildOptions } from '../platform.js';

import { type GetStyleDictionaryConfig, dsTransformers, prefix } from './shared.js';

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
            filter: (token) => typeEquals('color', token) && !R.startsWith(['global'], token.path),
          },
        ],
        options: {
          outputReferences: false,
        },
      },
    },
  };
};

type ColorCategoryOpts = { category: ColorCategories } | { category: 'builtin'; color: BuiltInColors };

export const colorCategoryVariables =
  (opts: ColorCategoryOpts): GetStyleDictionaryConfig =>
  ({ 'color-scheme': colorScheme, theme, ...permutation }) => {
    const category = opts.category;
    const color = category === 'builtin' ? opts.color : permutation[`${category}-color`];

    if (!color) {
      throw new Error(
        category === 'builtin'
          ? `Missing color for built-in color ${opts.color}`
          : `Missing color for category ${category}`,
      );
    }

    const layer = `ds.theme.color`;
    const isRootColor = color === buildOptions?.rootColor;
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
              filter: (token) =>
                category === 'builtin' ? isSemanticColorToken(token, color) : isColorCategoryToken(token, category),
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
