import * as R from 'ramda';
import { outputReferencesFilter } from 'style-dictionary/utils';
import { pathStartsWithOneOf, typeEquals } from '../../utils.js';
import { formats } from '../formats/css.js';

import { basePxFontSize, dsTransformers, type GetStyleDictionaryConfig, prefix } from './shared.js';

export const semanticVariables: GetStyleDictionaryConfig = ({ theme }) => {
  const selector = `:root`;
  const layer = `ds.theme.semantic`;

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
            destination: `semantic.css`,
            format: formats.semantic.name,
            filter: (token) => {
              const isUwantedToken = R.anyPass([R.includes('primitives/global')])(token.filePath);
              const isPrivateToken = R.includes('_', token.path);
              const unwantedPaths = pathStartsWithOneOf(
                ['size', '_size', 'font-scale', 'font-size', 'line-height', 'letter-spacing'],
                token,
              );
              const unwantedTypes = typeEquals(['color', 'fontWeight', 'fontFamily', 'typography'], token);
              const unwantedTokens = !(unwantedPaths || unwantedTypes || isPrivateToken || isUwantedToken);

              return unwantedTokens;
            },
          },
        ],
        options: {
          outputReferences: (token, options) => {
            const include = pathStartsWithOneOf(['border-radius'], token);
            return include && outputReferencesFilter(token, options);
          },
        },
      },
    },
  };
};
