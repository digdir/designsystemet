import * as R from 'ramda';
import type { Format, TransformedToken } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';
import { buildOptions } from '../../platform.js';

// Predicate to filter tokens with .path array that includes both typography and fontFamily
const typographyFontFamilyPredicate = R.allPass([
  R.pathSatisfies(R.includes('typography'), ['path']),
  R.pathSatisfies(R.includes('fontFamily'), ['path']),
]);

export const typography: Format = {
  name: 'ds/css-typography',
  format: async ({ dictionary, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer, files } = platform;
    const destination = files?.[0]?.destination as string;

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const filteredTokens = R.reject(typographyFontFamilyPredicate, dictionary.allTokens);

    const formattedMap = filteredTokens.map((token: TransformedToken) => ({
      token,
      formatted: format(token),
    }));

    buildOptions.buildTokenFormats[destination] = formattedMap;

    const formattedTokens = formattedMap.map(R.view(R.lensProp('formatted'))).join('\n');

    const content = selector ? `${selector} {\n${formattedTokens}\n}` : formattedTokens;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}` : content;

    return body;
  },
};
