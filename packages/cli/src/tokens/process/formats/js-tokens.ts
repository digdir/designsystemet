import * as R from 'ramda';
import type { Format, TransformedToken } from 'style-dictionary/types';
import { createPropertyFormatter, fileHeader } from 'style-dictionary/utils';

import { getType, inlineTokens, isColorCategoryToken, pathStartsWithOneOf } from '../../utils.js';
import { isInlineTokens, overrideSizingFormula } from './css/semantic.js';

const groupByType = R.groupBy((token: TransformedToken) => getType(token));

/** Add token name with prefix to list for removal */
const removeUnwatedTokens = R.pipe(
  R.reject((token: TransformedToken) => isColorCategoryToken(token)),
  R.reject((token: TransformedToken) => R.any((path: string) => path.startsWith('_'))(token.path)),
);

const dissocExtensions = R.pipe(R.dissoc('$extensions'), R.dissocPath(['original', '$extensions']));

const removeUnwatedProps = R.map((token: TransformedToken) => dissocExtensions(token) as TransformedToken);

const toCssVarName = R.pipe(R.split(':'), R.head, R.trim);

/**
 * Format for displaying tokens in storefront
 */
export const jsTokens: Format = {
  name: 'ds/js-tokens',
  format: async ({ dictionary, file, options }) => {
    const { usesDtcg, outputReferences } = options;
    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const formatTokens = R.map((token: TransformedToken) => {
      if (pathStartsWithOneOf(['size', '_size'], token)) {
        const { calc, name } = overrideSizingFormula(format, token);

        return {
          ...token,
          name: name.trim(),
          $value: calc.trim(),
        };
      }
      return {
        ...token,
        name: toCssVarName(format(token)),
      };
    });

    const processTokens = R.pipe(removeUnwatedTokens, removeUnwatedProps, formatTokens, groupByType);

    const tokens = processTokens(inlineTokens(isInlineTokens, dictionary.allTokens));

    const content = Object.entries(tokens)
      .map(
        ([name, token]) => `export const  ${name} = ${JSON.stringify(token, null, 2).replace(/"([^"]+)":/g, '$1:')} \n`,
      )
      .join('\n');

    return fileHeader({ file }).then((fileHeaderText) => fileHeaderText + content);
  },
};
