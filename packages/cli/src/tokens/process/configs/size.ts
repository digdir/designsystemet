import {} from '@tokens-studio/sd-transforms';
import * as R from 'ramda';
import type {} from 'style-dictionary/types';
import { outputReferencesFilter } from 'style-dictionary/utils';
import { isDigit, pathStartsWithOneOf } from '../../utils.js';
import { formats } from '../formats/css.js';

import { basePxFontSize, dsTransformers, type GetStyleDictionaryConfig, prefix } from './shared.js';

export const sizeVariables: GetStyleDictionaryConfig = ({ theme }) => {
  // [data-size] selector ensures --ds-size-* variables are recalculated when --ds-size-mode-font-size changes
  const selector = `:root, [data-size]`;
  const layer = `ds.theme.size`;

  return {
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        // custom
        theme,
        basePxFontSize,
        selector,
        layer,
        //
        prefix,
        buildPath: `${theme}/`,
        transforms: dsTransformers,
        files: [
          {
            destination: `size.css`,
            format: formats.size.name,
            filter: (token) => {
              const isUwantedToken = R.anyPass([R.includes('primitives/global')])(token.filePath);
              const isPrivateToken = R.includes('_', token.path);
              return pathStartsWithOneOf(['size', '_size'], token) && !(isUwantedToken || isPrivateToken);
              // R.equals(['_size', 'mode-font-size'], token.path) ||
            },
          },
        ],
        options: {
          outputReferences: (token, options) => {
            const isWantedSize = pathStartsWithOneOf(['size', '_size'], token) && isDigit(token.path[1]);
            return isWantedSize && outputReferencesFilter(token, options);
          },
        },
      },
    },
  };
};
