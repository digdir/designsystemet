import * as R from 'ramda';
import type { Dictionary, Format, TransformedToken } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';
import { buildOptions } from '../../platform.js';
import { sizingTemplate } from './size.js';

// Predicate to filter tokens with .path array that includes both typography and fontFamily
const isTypographyFontFamilyToken = R.allPass([
  R.pathSatisfies(R.includes('typography'), ['path']),
  R.pathSatisfies(R.includes('fontFamily'), ['path']),
]);
// Predicate to filter font-scale tokens
const isFontScaleToken = R.pathSatisfies(R.includes('font-scale'), ['path']);

type TokensWithCalcAndRoundFormatting = { tokens: TransformedToken[]; calc: string[]; round: string[] };

const formatTypographySizeToken = (
  dictionary: Dictionary,
  format: (t: TransformedToken) => string,
  token: TransformedToken,
): { name: string; calc: string; round: string } => {
  const [name, value] = format(token).replace(/;$/, '').split(': ');

  let calc: string;
  let round: string | undefined;
  if (R.startsWith(['font-size'], token.path)) {
    const originalWithCssReference = (token.original.$value as string).replaceAll(/\{font-scale\.[^}]+\}/g, (match) => {
      const t = dictionary.unfilteredTokenMap?.get(match);
      return `var(--${t?.name as string})`;
    });
    const cssCalcValue = originalWithCssReference.replace(/^roundTo\((.*), 0\)$/, '$1');
    calc = `calc(1rem * ${cssCalcValue})`;
    round = `round(${calc}, 1px)`;
  } else {
    calc = value;
  }
  return { name, calc, round: round ?? calc };
};

const formatTypographySizeTokens = (
  dictionary: Dictionary,
  format: (t: TransformedToken) => string,
  tokens: TransformedToken[],
) =>
  R.reduce<TransformedToken, TokensWithCalcAndRoundFormatting>(
    (acc, token) => {
      const { name, calc, round } = formatTypographySizeToken(dictionary, format, token);
      acc.tokens.push(token);
      acc.calc.push(`${name}: ${calc};`);
      acc.round.push(`${name}: ${round};`);
      return acc;
    },
    { tokens: [], calc: [], round: [] },
    tokens,
  );

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

    const filteredTokens = R.reject(R.anyPass([isTypographyFontFamilyToken, isFontScaleToken]), dictionary.allTokens);
    const formattedTokens = formatTypographySizeTokens(dictionary, format, filteredTokens);

    const formattedMap = formattedTokens.round.map((t, i) => ({
      token: formattedTokens.tokens[i],
      formatted: t,
    }));

    buildOptions.buildTokenFormats[destination] = formattedMap;

    const content = `${selector} {${sizingTemplate(formattedTokens)}\n}`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}` : content;

    return body;
  },
};
