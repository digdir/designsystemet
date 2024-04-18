import * as R from 'ramda';
import type { TransformedToken, Format } from 'style-dictionary/types';
import {
  fileHeader,
  createPropertyFormatter,
  usesReferences,
  getReferences,
} from 'style-dictionary/utils';

type ReferencesFilter = (token: TransformedToken) => boolean;

/**
 *  CSS variables format with option to include source references for matched token through `options.referencesFilter`
 */
export const scopedReferenceVariables: Format = {
  name: 'css/variables-scoped-references',
  formatter: function ({ dictionary, options, file }) {
    const { outputReferences } = options;
    const includeReferences = options.referencesFilter as ReferencesFilter;
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

    const tokens = dictionary.allTokens
      .map((token) => {
        if (usesReferences(token.original.value) && includeReferences(token)) {
          const refs = getReferences(token.original.value);

          referencedTokens = [
            ...referencedTokens,
            ...refs.filter((x) => x.isSource),
          ];

          return formatWithReference(token);
        }

        return !token.isSource && format(token);
      })
      .filter((x) => x);

    const referenceTokens = referencedTokens
      .reduce<{ name: string; formatted: string }[]>((acc, token) => {
        if (acc.find((x) => x.name === token.name)) {
          return acc;
        }

        return [...acc, { name: token.name, formatted: format(token) }];
      }, [])
      .map((x) => x.formatted)
      .filter((x) => x);

    return (
      fileHeader({ file }) +
      ':root {\n' +
      '  /** Referenced source tokens */ \n' +
      '  /** DO NOT OVERRIDE */ \n' +
      referenceTokens.join('\n') +
      '\n\n  /** Tokens */ \n' +
      tokens.join('\n') +
      '\n}\n'
    );
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
  formatter: function ({ dictionary, file }) {
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

    const content =
      fileHeader({ file }) +
      Object.entries(tokens)
        .map(
          ([name, token]) =>
            `export const  ${name} = ${JSON.stringify(token, null, 2).replace(
              /"([^"]+)":/g,
              '$1:',
            )} \n`,
        )
        .join('\n');

    return content;
  },
};
