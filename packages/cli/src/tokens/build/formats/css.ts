import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter, fileHeader, usesReferences } from 'style-dictionary/utils';

import { type IsCalculatedToken, colorCategories } from '../types.js';
import { getValue, isColorCategoryToken, isGlobalColorToken, isSemanticToken } from '../utils/utils.js';

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
    }, dictionary.allTokens);

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
