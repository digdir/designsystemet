import path from 'path';

import * as R from 'ramda';
import prettier from 'prettier';
import StyleDictionary from 'style-dictionary';
import type { Named, TransformedToken, Format } from 'style-dictionary';

const { fileHeader, createPropertyFormatter } = StyleDictionary.formatHelpers;

const prettierConfig = path.resolve('./../../../prettier.config.js');
const prettierOptions = prettier.resolveConfig.sync(prettierConfig);

type ReferencesFilter = (token: TransformedToken) => boolean;

/**
 *  CSS variables format with option to include source references for matched token through `options.referencesFilter`
 */
export const scopedReferenceVariables: Named<Format> = {
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
        if (
          dictionary.usesReference(token.original.value) &&
          includeReferences(token)
        ) {
          const refs = dictionary.getReferences(token.original.value);

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

const groupByPathIndex = (level: number, tokens: TransformedToken[]) =>
  R.groupBy((token: TransformedToken) => token.path[level], tokens);

const shouldGroupPath = (level: number, tokens: TransformedToken[]) => {
  const token = R.head(tokens);
  const [, next] = R.splitAt(level, token?.path ?? []);
  return next.length > 1;
};

const groupByNextPathIndex = <
  T extends Partial<Record<string, TransformedToken[]>>,
>(
  level: number,
  record: T,
): Record<string, unknown> =>
  R.mapObjIndexed((tokens, key, obj) => {
    if (R.isNil(tokens) || R.isNil(obj)) {
      return tokens;
    }

    if (shouldGroupPath(level, tokens)) {
      const grouped = groupByPathIndex(level, tokens);
      return groupByNextPathIndex(level + 1, grouped);
    }
    return tokens;
  }, record || {});

const groupFromPathIndex = R.curry(groupByNextPathIndex);
const groupTokens = R.pipe(groupByType, groupFromPathIndex(0));
const toCssVarName = R.pipe(R.split(':'), R.head, R.trim);
/**
 * Format for displaying tokens in storefront
 */
export const storefront: Named<Format> = {
  name: 'storefront',
  formatter: function ({ dictionary, file }) {
    const format = createPropertyFormatter({
      dictionary,
      format: 'css',
    });

    const formattedTokens = dictionary.allTokens.map((token) => ({
      ...token,
      lastName: R.last(token.path),
      name: toCssVarName(format(token)),
    }));

    const tokens = groupTokens(formattedTokens);

    const content =
      fileHeader({ file }) +
      Object.entries(tokens)
        .map(
          ([name, token]) =>
            `export const  ${name} = ${JSON.stringify(token, null, 2)} \n`,
        )
        .join('\n');

    return prettier.format(content, {
      ...prettierOptions,
      parser: 'babel',
    });
  },
};
