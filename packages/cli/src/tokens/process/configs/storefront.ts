import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary/types';
import { outputReferencesFilter } from 'style-dictionary/utils';
import { isDigit, pathStartsWithOneOf, typeEquals } from '../../utils.js';
import { jsTokens } from '../formats/js-tokens.js';

import { type GetStyleDictionaryConfig, basePxFontSize, dsTransformers, prefix } from './shared.js';

export const typescriptTokens: GetStyleDictionaryConfig = ({ 'color-scheme': colorScheme, theme }) => {
  return {
    preprocessors: ['tokens-studio'],
    platforms: {
      ts: {
        prefix,
        basePxFontSize,
        transforms: dsTransformers,
        buildPath: `${theme}/`,
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
