import * as R from 'ramda';
import type { Format, TransformedToken } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';

// Predicate to filter tokens with .path array that includes both typography and fontFamily
const typographyFontFamilyPredicate = R.allPass([
  R.pathSatisfies(R.includes('typography'), ['path']),
  R.pathSatisfies(R.includes('fontFamily'), ['path']),
]);

type Size = 'sm' | 'md' | 'lg';

const togglePrefix = '--ds-data-size';
const sizeToggles = {
  sm: `${togglePrefix}--sm`,
  md: `${togglePrefix}--md`,
  lg: `${togglePrefix}--lg`,
};

const getLookupTokenName = (size: Size, tokenName: string): string => tokenName.replace(/^ds-/, `_ds__${size}__`);

const lookupVariablesInOrder = (variables: string[], fallback: string): string => {
  let cssString = '';
  for (const variable of variables) {
    cssString += `var(${variable}, `;
  }
  cssString += fallback;
  cssString += R.repeat(')', variables.length).join('');
  return cssString;
};

const toInternalSizeToken =
  (size: Size) =>
  (token: TransformedToken): TransformedToken => {
    return {
      ...token,
      name: getLookupTokenName(size, token.name),
      $value: `var(${sizeToggles[size]}) ${token.$value}`,
    };
  };

function toSizeLookup(token: TransformedToken): TransformedToken {
  const sizeVars = (['sm', 'md', 'lg'] as const).map((size) => `--${getLookupTokenName(size, token.name)}`);
  return {
    ...token,
    $value: lookupVariablesInOrder(sizeVars, token.$value),
  };
}
export const typographySize: Format = {
  name: 'ds/css-typography-size',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer, size } = platform;

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const filteredTokens = R.reject(typographyFontFamilyPredicate, dictionary.allTokens);

    const formattedTokens = R.pipe(R.map(toInternalSizeToken(size)), R.map(format), R.join('\n'))(filteredTokens);
    const defaultTokens = R.pipe(R.map(toSizeLookup), R.map(format), R.join('\n'))(filteredTokens);

    const sizeSpecificContent = `${selector} /* ${size} */ {\n${formattedTokens}\n}`;
    const sizeLookupContent = size === 'md' ? `\n${selector} {\n${defaultTokens}\n}` : '';
    const content = `${sizeSpecificContent}${sizeLookupContent}`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}` : content;

    return body;
  },
};
