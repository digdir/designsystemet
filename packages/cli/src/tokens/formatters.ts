import * as R from 'ramda';
import type { TransformedToken, Format } from 'style-dictionary/types';
import {
  fileHeader,
  createPropertyFormatter,
  usesReferences,
  getReferences,
} from 'style-dictionary/utils';

type IncludeReferences = (token: TransformedToken) => boolean;

/**
 *  CSS variables format with option to include source references for matched token through `options.referencesFilter`
 */
export const scopedReferenceVariables: Format = {
  name: 'css/variables-scoped-references',
  format: async function ({ dictionary, file, options }) {
    const { allTokens, unfilteredTokens } = dictionary;
    const { usesDtcg, outputReferences } = options;
    const includeReferences = options.includeReferences as IncludeReferences;
    let referencedTokens: TransformedToken[] = [];

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const formatWithReference = createPropertyFormatter({
      outputReferences: true,
      dictionary,
      format: 'css',
    });

    const parseToken = (token: TransformedToken, ignoreSource?: boolean) => {
      const originalValue = (
        usesDtcg ? token.original.$value : token.original.value
      ) as string;

      if (usesReferences(originalValue) && includeReferences(token)) {
        const refs = getReferences(
          originalValue,
          unfilteredTokens ? unfilteredTokens : {},
        );

        referencedTokens = [
          ...referencedTokens,
          ...refs.filter((x) => x.isSource),
        ];

        return formatWithReference(token);
      }

      if (ignoreSource && !token.isSource) {
        return format(token);
      }
    };

    const tokens = allTokens.map((t) => parseToken(t, true)).filter((x) => x);

    const referenceTokens = referencedTokens
      .reduce<TransformedToken[]>((acc, token) => {
        if (acc.find((x) => x.name === token.name)) {
          return acc;
        }

        return [...acc, token];
      }, [])
      .map((token) => format(token))
      .filter((formattedValue) => formattedValue);

    return fileHeader({ file }).then((fileHeaderText) => {
      const content = `
${fileHeaderText}
:root {
  /** Referenced source tokens */
  /** DO NOT OVERRIDE */
${referenceTokens.join('\n')}
  /** Tokens */
${tokens.join('\n')}
}
      `;

      return content;
    });
  },
};

const groupByType = R.groupBy(
  (token: TransformedToken) => token.type as string,
);

/** Add token name with prefix to list for removal */
const removeUnwatedTokens = R.filter(
  (token: TransformedToken) =>
    !['fds-base_spacing', 'fds-base_sizing'].includes(token.name),
);

const toCssVarName = R.pipe(R.split(':'), R.head, R.trim);

/**
 * Format for displaying tokens in storefront
 */
export const groupedTokens: Format = {
  name: 'groupedTokens',
  format: async function ({ dictionary, file }) {
    const format = createPropertyFormatter({
      dictionary,
      format: 'css',
    });

    const formatTokens = R.map((token: TransformedToken) => ({
      ...token,
      name: toCssVarName(format(token)),
    }));

    const processTokens = R.pipe(
      removeUnwatedTokens,
      formatTokens,
      groupByType,
    );

    const tokens = processTokens(dictionary.allTokens);

    const content = Object.entries(tokens)
      .map(
        ([name, token]) =>
          `export const  ${name} = ${JSON.stringify(token, null, 2).replace(
            /"([^"]+)":/g,
            '$1:',
          )} \n`,
      )
      .join('\n');

    return fileHeader({ file }).then(
      (fileHeaderText) => fileHeaderText + content,
    );
  },
};
