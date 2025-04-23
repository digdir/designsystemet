import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';
import { inlineTokens, isDigit, pathStartsWithOneOf } from '../../../utils.js';

const isNumericBorderRadiusToken = (t: TransformedToken) => t.path[0] === 'border-radius' && isDigit(t.path[1]);
const isNumericSizeToken = (t: TransformedToken) => pathStartsWithOneOf(['size'], t) && isDigit(t.path[1]);
const isSizeToken = (t: TransformedToken) => pathStartsWithOneOf(['size'], t);

export const isInlineTokens = R.anyPass([isNumericBorderRadiusToken, isNumericSizeToken, isSizeToken]);

/**
 * Overrides the default sizing formula with a custom one that supports [round()](https://developer.mozilla.org/en-US/docs/Web/CSS/round) if supported.
 *
 * @param format - Function to format a token into a CSS property string.
 * @param tokens - Array of transformed tokens to format.
 * @returns Object with formatted CSS strings for calc and round.
 */
export const overrideSizingFormula = (format: (t: TransformedToken) => string, token: TransformedToken) => {
  const [name, value] = format(token).split(':');

  const calc = value.replace(`var(--ds-size-mode-font-size)`, '1em').replace(/floor\((.*)\);/, 'calc($1)');

  const round = `round(down, ${calc}, 0.0625rem)`;

  return {
    name,
    round,
    calc,
  };
};

/**
 * Formats sizing tokens into CSS properties with support for rounding.
 *
 * @param format - Function to format a token into a CSS property string.
 * @param tokens - Array of transformed tokens to format.
 * @returns Formatted CSS string with default calc and [round()](https://developer.mozilla.org/en-US/docs/Web/CSS/round) if supported.
 */
const formatSizingTokens = (format: (t: TransformedToken) => string, tokens: TransformedToken[]) => {
  const { round, calc } = R.reduce(
    (acc, token) => {
      const { round, calc, name } = overrideSizingFormula(format, token);

      return {
        round: [...acc.round, `${name}: ${round};`],
        calc: [...acc.calc, `${name}: ${calc};`],
      };
    },
    { round: [], calc: [] } as { round: string[]; calc: string[] },
    tokens,
  );

  return `
${calc.join('\n')}\n
  @supports (width: round(down, .1em, 1px)) {
${round.join('\n')}
  }`;
};

export const semantic: Format = {
  name: 'ds/css-semantic',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer } = platform;

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const tokens = inlineTokens(isInlineTokens, dictionary.allTokens);
    const filteredTokens = R.reject((token) => token.name.includes('ds-size-mode-font-size'), tokens);
    const [sizingTokens, restTokens] = R.partition(
      (t: TransformedToken) => pathStartsWithOneOf(['_size'], t) && isDigit(t.path[1]),
      filteredTokens,
    );
    const formattedTokens = [R.map(format, restTokens).join('\n'), formatSizingTokens(format, sizingTokens)];

    const content = `{\n${formattedTokens.join('\n')}\n}\n`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${selector} ${content}\n}\n` : `${selector} ${content}\n`;

    return body;
  },
};
