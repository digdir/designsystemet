/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import path from 'path';

import * as R from 'ramda';
// import prettier from 'prettier';
import type { TransformedToken, Format } from 'style-dictionary/types';
import {
  fileHeader,
  createPropertyFormatter,
  usesReferences,
  getReferences,
} from 'style-dictionary/utils';

type PropertyFormat = ReturnType<typeof createPropertyFormatter>;

type ReferencesFilter = (token: TransformedToken) => boolean;

// let prettierOptions: prettier.Options | null;

// export const setup = (prettierConfigPath: string) => {
//   prettierOptions = prettier.resolveConfig.sync(
//     path.resolve(prettierConfigPath),
//   );
//   if (!prettierOptions) {
//     throw Error(`Prettier config not found at ${prettierConfigPath}`);
//   }
// };

/**
 *  CSS variables format with option to include source references for matched token through `options.referencesFilter`
 */
export const scopedReferenceVariables: Format = {
  name: 'css/variables-scoped-references',
  formatter: async function ({ dictionary, options, file }) {
    const { outputReferences } = options;
    const includeReferences = options.referencesFilter as ReferencesFilter;
    let referencedTokens: TransformedToken[] = [];

    const format: PropertyFormat = createPropertyFormatter({
      format: 'css',
      dictionary,
      outputReferences,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const formatWithReference = createPropertyFormatter({
      outputReferences: true,
      dictionary,
      format: 'css',
    });

    const tokens = dictionary.allTokens
      .map((token) => {
        if (usesReferences(token.original.value) && includeReferences(token)) {
          const refs: TransformedToken[] = getReferences(
            token.original.value,
            token,
          );

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
      (await fileHeader({ file })) +
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
            `export const  ${name} = ${JSON.stringify(token, null, 2)} \n`,
        )
        .join('\n');

    return content;
    // return prettier.format(content, {
    //   ...prettierOptions,
    //   parser: 'babel',
    // });
  },
};
