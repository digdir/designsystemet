import * as R from 'ramda';
import type { Format, TransformedToken } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';
import { pathStartsWithOneOf, shortSizeName } from '../../../utils.js';
import { basePxFontSize } from '../../configs/shared.js';
import { buildOptions } from '../../platform.js';

// Predicate to filter tokens with .path array that includes both typography and fontFamily
const typographyFontFamilyPredicate = R.allPass([
  R.pathSatisfies(R.includes('typography'), ['path']),
  R.pathSatisfies(R.includes('fontFamily'), ['path']),
]);

const formatBaseSizeToken =
  (size: string) =>
  (token: TransformedToken): TransformedToken => ({
    ...token,
    name: `${token.name}--${shortSizeName(size)}`,
    $value: parseInt(token.$value.replace('px', '')) / basePxFontSize,
  });

function formatTypographySizeToken(token: TransformedToken): TransformedToken {
  return { ...token, $value: `calc(${token.$value} * var(--_ds-font-size-factor))` };
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

    const [sizeSpecificTokens, otherTokens] = R.partition(
      pathStartsWithOneOf([['_size', 'mode-font-size']]),
      filteredTokens,
    );
    const sizeSpecificVariables = R.applyTo(
      sizeSpecificTokens,
      R.pipe(R.map(R.pipe(formatBaseSizeToken(size), format)), R.join('\n')),
    );
    const fontSizeVariables = R.applyTo(
      otherTokens,
      R.pipe(R.map(R.pipe(formatTypographySizeToken, format)), R.join('\n')),
    );

    const sizeSpecificContent = `${selector} /* ${size} */ {\n${sizeSpecificVariables}\n}`;
    const sizeFactor = `  --_ds-font-size-factor: calc(var(--ds-size-mode-font-size) / (var(--ds-size-base) / ${basePxFontSize}));`;
    const sizeLookupContent =
      size === buildOptions?.defaultSize ? `\n${selector} {\n${sizeFactor}\n${fontSizeVariables}\n}` : '';
    const content = `${sizeSpecificContent}${sizeLookupContent}`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}` : content;

    return body;
  },
};
