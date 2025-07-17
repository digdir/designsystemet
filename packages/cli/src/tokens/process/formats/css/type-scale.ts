import * as R from 'ramda';
import type { Format, TransformedToken } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';
import { basePxFontSize } from '../../configs/shared.js';
import { buildOptions } from '../../platform.js';

// Predicate to filter tokens with .path array that includes both typography and fontFamily
const typographyFontFamilyPredicate = R.allPass([
  R.pathSatisfies(R.includes('typography'), ['path']),
  R.pathSatisfies(R.includes('fontFamily'), ['path']),
]);

function formatTypographySizeToken(token: TransformedToken): TransformedToken {
  return { ...token, $value: `calc(${token.$value} * var(--_ds-font-size-factor))` };
}

export const typeScale: Format = {
  name: 'ds/css-type-scale',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer } = platform;
    const destination = file.destination as string;

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const filteredTokens = R.reject(typographyFontFamilyPredicate, dictionary.allTokens);
    const tokens = R.map(formatTypographySizeToken, filteredTokens);

    const formattedMap = tokens.map((token) => ({
      token,
      formatted: format(token),
    }));

    buildOptions.buildTokenFormats[destination] = formattedMap;

    const formattedTokens = formattedMap.map(R.prop('formatted')).join('\n');

    const sizeFactor = `  --_ds-font-size-factor: calc(var(--ds-size-mode-font-size) / (var(--ds-size-base) / ${basePxFontSize}));`;
    const content = `${selector} {\n${sizeFactor}\n${formattedTokens}\n}`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}` : content;

    return body;
  },
};
