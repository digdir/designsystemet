import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter, fileHeader } from 'style-dictionary/utils';

import {
  getValue,
  isColorCategoryToken,
  isGlobalColorToken,
  isSemanticToken,
  pathStartsWithOneOf,
} from '../../utils.js';
import { colorCategories } from '../types.js';

/**
 * In the given tokens array, inline and remove tokens that match the predicate
 *
 * Example: In pseudo-code, given the predicate `(token) => token.path === ['size', '1']` and the following tokens
 * ```js
 *  [
 *    { path: ['size', 'base'], original: { $value: '8px' } },
 *    { path: ['size', '1'], original: { $value: '{size.base} * 2' } },
 *    { path: ['size', 'sm']: original: { $value: 'min({size.1}, 12px)' } }
 *  ]
 * ```
 * would return
 * ```js
 *  [
 *    { path: ['size', 'base'], original: { $value: '8px' } },
 *    { path: ['size', 'sm']: original: { $value: 'min({size.base} * 2, 12px)' } }
 *  ]
 * ```
 *
 * @param shouldInline - predicate to determine if token should be inlined
 * @param tokens - array of tokens to transform
 * @returns copy of `tokens` without those that matched the predicate,
 *          where references to the matching tokens have been inlined
 */
export function inlineTokens(shouldInline: (t: TransformedToken) => boolean, tokens: TransformedToken[]) {
  const [inlineableTokens, otherTokens] = R.partition(shouldInline, tokens);
  return otherTokens.map((token: TransformedToken) => {
    // Inline the tokens that satisfy shouldInline().
    let transformed = getValue<string>(token.original);
    for (const ref of inlineableTokens) {
      const refName = ref.path.join('.');
      transformed = transformed.replaceAll(`{${refName}}`, getValue<string>(ref.original));
    }
    const tokenWithInlinedRefs = R.set(R.lensPath(['original', '$value']), transformed, token);
    return tokenWithInlinedRefs;
  });
}

const prefersColorScheme = (colorScheme: string, content: string) => `
@media (prefers-color-scheme: ${colorScheme}) {
  [data-color-scheme="auto"] ${content}
}
`;

const colorScheme: Format = {
  name: 'ds/css-colorscheme',
  format: async ({ dictionary, file, options, platform }) => {
    const { allTokens } = dictionary;
    const { outputReferences, usesDtcg } = options;
    const { selector, colorScheme, layer } = platform;

    const colorScheme_ = colorScheme as string;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const colorSchemeProperty =
      colorScheme_ === 'dark' || colorScheme_ === 'light' ? `\n  color-scheme: ${colorScheme_};\n` : '';

    const filteredAllTokens = allTokens.filter(
      R.allPass([
        R.anyPass([
          // Include semantic tokens in the output
          isSemanticToken,
          // Include global color tokens
          isGlobalColorToken,
        ]),
        // Don't include color category tokens -- they are exported separately
        (t) => !isColorCategoryToken(t),
      ]),
    );
    const formattedTokens = filteredAllTokens.map(format).join('\n');
    const content = `{\n${formattedTokens}\n${colorSchemeProperty}}\n`;
    const autoSelectorContent = ['light', 'dark'].includes(colorScheme_)
      ? prefersColorScheme(colorScheme_, content)
      : '';
    const body = R.isNotNil(layer)
      ? `@layer ${layer} {\n${selector} ${content} ${autoSelectorContent}\n}\n`
      : `${selector} ${content} ${autoSelectorContent}\n`;

    return header + body;
  },
};

declare module 'style-dictionary/types' {
  export interface LocalOptions {
    replaceCategoryWith?: string;
  }
}

const colorCategory: Format = {
  name: 'ds/css-colorcategory',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg, replaceCategoryWith = '' } = options;
    const { selector, layer } = platform;

    const header = await fileHeader({ file });

    const format = R.compose(
      createPropertyFormatter({
        outputReferences,
        dictionary,
        format: 'css',
        usesDtcg,
      }),
      (token: TransformedToken) => ({
        ...token,
        name: token.name.replace(
          new RegExp(`-(${colorCategories.main}|${colorCategories.support})-`),
          replaceCategoryWith ? `-${replaceCategoryWith}-` : '-',
        ),
      }),
    );

    const formattedTokens = dictionary.allTokens.map(format).join('\n');
    const content = `{\n${formattedTokens}\n}\n`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${selector} ${content}\n}\n` : `${selector} ${content}\n`;

    return header + body;
  },
};

const isDigit = (s: string) => /^\d+$/.test(s);
const isNumericBorderRadiusToken = (t: TransformedToken) => t.path[0] === 'border-radius' && isDigit(t.path[1]);

const isUwantedTokens = R.anyPass([isNumericBorderRadiusToken]);

/**
 * Overrides the default sizing formula with a custom one that supports [round()](https://developer.mozilla.org/en-US/docs/Web/CSS/round) if supported.
 *
 * @param format - Function to format a token into a CSS property string.
 * @param tokens - Array of transformed tokens to format.
 * @returns Object with formatted CSS strings for calc and round.
 */
export const overrideSizingFormula = (format: (t: TransformedToken) => string, token: TransformedToken) => {
  const [name, value] = format(token).split(':');

  const calc = value.replace(`var(--ds-size-mode-font-size)`, '1em').replace(/floor\((.*)\);/, 'calc($1);');

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
        round: [...acc.round, `${name}: ${round}`],
        calc: [...acc.calc, `${name}: ${calc}`],
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

const semantic: Format = {
  name: 'ds/css-semantic',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer } = platform;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const tokens = inlineTokens(isUwantedTokens, dictionary.allTokens);
    const filteredTokens = R.reject((token) => token.name.includes('ds-size-mode-font-size'), tokens);
    const [sizingTokens, restTokens] = R.partition(pathStartsWithOneOf(['size']), filteredTokens);
    const formattedTokens = [R.map(format, restTokens).join('\n'), formatSizingTokens(format, sizingTokens)];

    const content = `{\n${formattedTokens.join('\n')}\n}\n`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${selector} ${content}\n}\n` : `${selector} ${content}\n`;

    return header + body;
  },
};

// Predicate to filter tokens with .path array that includes both typography and fontFamily
const typographyFontFamilyPredicate = R.allPass([
  R.pathSatisfies(R.includes('typography'), ['path']),
  R.pathSatisfies(R.includes('fontFamily'), ['path']),
]);

const typography: Format = {
  name: 'ds/css-typography',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer } = platform;

    const header = await fileHeader({ file });

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

    return header + body;
  },
};

export const formats = {
  colorScheme,
  colorCategory,
  semantic,
  typography,
} satisfies Record<string, Format>;
