import * as R from 'ramda';
import type { TransformedToken, Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter } from 'style-dictionary/utils';

const groupByType = R.groupBy((token: TransformedToken) => token.type as string);

/** Add token name with prefix to list for removal */
const removeUnwatedTokens = R.filter(
  (token: TransformedToken) => !['fds-base_spacing', 'fds-base_sizing'].includes(token.name),
);

const toCssVarName = R.pipe(R.split(':'), R.head, R.trim);

/**
 * Format for displaying tokens in storefront
 */
export const storefrontFormat: Format = {
  name: 'ds/storefront',
  format: async function ({ dictionary, file }) {
    const format = createPropertyFormatter({
      dictionary,
      format: 'css',
    });

    const formatTokens = R.map((token: TransformedToken) => ({
      ...token,
      name: toCssVarName(format(token)),
    }));

    const processTokens = R.pipe(removeUnwatedTokens, formatTokens, groupByType);

    const tokens = processTokens(dictionary.allTokens);

    const content = Object.entries(tokens)
      .map(
        ([name, token]) => `export const  ${name} = ${JSON.stringify(token, null, 2).replace(/"([^"]+)":/g, '$1:')} \n`,
      )
      .join('\n');

    return fileHeader({ file }).then((fileHeaderText) => fileHeaderText + content);
  },
};
