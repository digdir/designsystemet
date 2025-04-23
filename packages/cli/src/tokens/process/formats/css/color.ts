import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';

import { colorCategories } from '../../../types.js';
import { isColorCategoryToken, isGlobalColorToken, isSemanticToken } from '../../../utils.js';

const prefersColorScheme = (colorScheme: string, content: string) => `
@media (prefers-color-scheme: ${colorScheme}) {
  [data-color-scheme="auto"] ${content}
}
`;

export const colorScheme: Format = {
  name: 'ds/css-colorscheme',
  format: async ({ dictionary, file, options, platform }) => {
    const { allTokens } = dictionary;
    const { outputReferences, usesDtcg } = options;
    const { selector, colorScheme, layer } = platform;

    const colorScheme_ = colorScheme as string;

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

    return body;
  },
};

export const colorCategory: Format = {
  name: 'ds/css-colorcategory',
  format: async ({ dictionary, file, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer } = platform;

    const format = R.compose(
      createPropertyFormatter({
        outputReferences,
        dictionary,
        format: 'css',
        usesDtcg,
      }),
      (token: TransformedToken) => ({
        ...token,
        name: token.name.replace(/color-\w+-/, 'color-'),
        original: {
          ...token.original,
          $value: new RegExp(`color-(${colorCategories.main}|${colorCategories.support})-`).test(token.name)
            ? token.original.$value
            : `{${token.path.join('.')}}`,
        },
      }),
    );

    const formattedTokens = dictionary.allTokens.map(format).join('\n');
    const content = `{\n${formattedTokens}\n}\n`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${selector} ${content}\n}\n` : `${selector} ${content}\n`;

    return body;
  },
};
