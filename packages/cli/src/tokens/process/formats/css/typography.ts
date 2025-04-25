import * as R from 'ramda';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';

// Predicate to filter tokens with .path array that includes both typography and fontFamily
const typographyFontFamilyPredicate = R.allPass([
  R.pathSatisfies(R.includes('typography'), ['path']),
  R.pathSatisfies(R.includes('fontFamily'), ['path']),
]);

export const typography: Format = {
  name: 'ds/css-typography',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer } = platform;

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const filteredTokens = R.reject(typographyFontFamilyPredicate, dictionary.allTokens);

    const formattedTokens = R.pipe(R.map(format), R.join('\n'))(filteredTokens);

    const content = selector ? `${selector} {\n${formattedTokens}\n}` : formattedTokens;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}` : content;

    return body;
  },
};
