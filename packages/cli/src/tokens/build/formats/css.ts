import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter, fileHeader, usesReferences } from 'style-dictionary/utils';

import { getValue, isColorCategoryToken, isGlobalColorToken, isSemanticToken } from '../../utils.js';
import { type IsCalculatedToken, colorCategories } from '../types.js';

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
function inlineTokens(shouldInline: (t: TransformedToken) => boolean, tokens: TransformedToken[]) {
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

const calculatedVariable = R.pipe(R.split(/:(.*?);/g), (split) => `${split[0]}: calc(${R.trim(split[1])});`);

const semantic: Format = {
  name: 'ds/css-semantic',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, isCalculatedToken, layer } = platform;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const isDigit = (s: string) => /^\d+$/.test(s);
    const isUnwantedBorderRadiusToken = (t: TransformedToken) => t.path[0] === 'border-radius' && isDigit(t.path[1]);
    const tokens = inlineTokens(isUnwantedBorderRadiusToken, dictionary.allTokens);

    const formattedTokens = R.map((token: TransformedToken) => {
      const originalValue = getValue<string>(token.original);

      if (
        usesReferences(originalValue) &&
        typeof outputReferences === 'function' &&
        outputReferences?.(token, { dictionary })
      ) {
        if ((isCalculatedToken as IsCalculatedToken)?.(token, options)) {
          return calculatedVariable(format(token));
        }
        return format(token);
      }

      return format(token);
    }, tokens);

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
