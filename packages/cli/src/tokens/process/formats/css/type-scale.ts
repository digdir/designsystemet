import * as R from 'ramda';
import type { Dictionary, Format, TransformedToken } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';
import { orderBySize, shortSizeName } from '../../../utils.js';
import { buildOptions } from '../../platform.js';
import { sizingTemplate } from './size.js';
import { wrapInLayer } from './size-mode.js';

// Predicate to filter tokens with .path array that includes both typography and fontFamily
const isTypographyFontFamilyToken = R.allPass([
  R.pathSatisfies(R.includes('typography'), ['path']),
  R.pathSatisfies(R.includes('fontFamily'), ['path']),
]);
// Predicate to filter font-scale tokens
const isFontScaleToken = R.pathSatisfies(R.includes('font-scale'), ['path']);

type TokensWithCalcAndRoundFormatting = {
  tokens: TransformedToken[];
  calc: string[];
  round: string[];
  name: string[];
  originalName: string[];
};

const formatTypographySizeToken = (
  dictionary: Dictionary,
  format: (t: TransformedToken) => string,
  token: TransformedToken,
  size?: string,
): { name: string; originalName: string; calc: string; round: string } => {
  const [originalName, value] = format(token).trim().replace(/;$/, '').split(': ');
  // If we have a size, we're using static type scale values, and need to output the static values per mode.
  const name =
    size && R.startsWith(['font-size'], token.path) ? `${originalName}--${shortSizeName(size)}` : originalName;

  let calc: string;
  let round: string | undefined;
  // If we don't have a size, it means we're using modular type scale values.
  // That means we need to translate the Tokens Studio formulas to css.
  if (!size && R.startsWith(['font-size'], token.path)) {
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
  return { name, originalName, calc, round: round ?? calc };
};

const formatTypographySizeTokens = (
  dictionary: Dictionary,
  format: (t: TransformedToken) => string,
  tokens: TransformedToken[],
  size?: string,
) =>
  R.reduce<TransformedToken, TokensWithCalcAndRoundFormatting>(
    (acc, token) => {
      const { name, calc, round, originalName } = formatTypographySizeToken(dictionary, format, token, size);
      acc.tokens.push(token);
      acc.name.push(name);
      acc.originalName.push(originalName);
      acc.calc.push(`${name}: ${calc};`);
      acc.round.push(`${name}: ${round};`);
      return acc;
    },
    { tokens: [], calc: [], round: [], name: [], originalName: [] },
    tokens,
  );

export const typeScale: Format = {
  name: 'ds/css-type-scale',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer, size } = platform as { selector: string; layer?: string; size?: string };
    const destination = file.destination as string;

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const filteredTokens = R.reject(R.anyPass([isTypographyFontFamilyToken, isFontScaleToken]), dictionary.allTokens);
    const [typeScaleTokens, restTokens] = R.partition((t) => R.startsWith(['font-size'], t.path), filteredTokens);
    const formatted = formatTypographySizeTokens(dictionary, format, typeScaleTokens, size);
    const formattedReferences = formatTypographySizeTokens(dictionary, format, restTokens, size);

    const formattedMap = formatted.round.map((s, i) => ({
      token: formatted.tokens[i],
      // Remove the `--<size>` suffix for the token listing, since that is the only token we actually use
      formatted: s.replace(formatted.name[i], formatted.originalName[i]),
    }));

    const formattedReferencesMap = formattedReferences.round.map((s, i) => {
      return { token: formattedReferences.tokens[i], formatted: s };
    });

    buildOptions.buildTokenFormats[destination] = [...formattedMap, ...formattedReferencesMap];

    const optionalSizeComment = size ? ` /* ${size} */` : '';
    const content = `${selector}${optionalSizeComment} {${sizingTemplate(formatted)}\n}`;
    const body = wrapInLayer(content, layer);

    /*
     * The following CSS is only generated once, not per mode
     */
    const sizes = orderBySize(buildOptions?.sizeModes ?? []).map(shortSizeName);

    const fontScaleToggles = size
      ? formatted.originalName
          .map(
            (variable) => `  ${variable}:
${sizes.map((size) => `    var(--ds-size--${size}, var(${variable}--${size}))`).join('\n')};`,
          )
          .join('\n')
      : `  --ds-font-scale-base:
${sizes.map((size) => `    var(--ds-size--${size}, var(--ds-font-scale-base--${size}))`).join('\n')};
  --ds-font-scale-ratio:
${sizes.map((size) => `    var(--ds-size--${size}, var(--ds-font-scale-ratio--${size}))`).join('\n')};`;

    const referenceVariables = restTokens.map(format).join('\n');
    const sharedContent = `:root, [data-size] {
${fontScaleToggles}
${referenceVariables}
}`;

    const sharedBody = !size || shortSizeName(size) === R.last(sizes) ? `\n${wrapInLayer(sharedContent, layer)}` : '';
    /*
     * End of generated-once CSS
     */

    return body + sharedBody;
  },
};
