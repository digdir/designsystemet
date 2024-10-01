import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter, fileHeader, getReferences, usesReferences } from 'style-dictionary/utils';

import type { IsCalculatedToken } from '../configs.js';
import { prefix } from '../configs.js';
import { getValue, typeEquals } from '../utils/utils.js';

const prefersColorScheme = (mode: string, content: string) => `
@media (prefers-color-scheme: ${mode}) {
  [data-ds-color-mode="auto"] ${content}
}
`;

export const colormode: Format = {
  name: 'ds/css-colormode',
  format: async ({ dictionary, file, options, platform }) => {
    const { allTokens } = dictionary;
    const { outputReferences, usesDtcg } = options;
    const { selector, mode, layer } = platform;

    const mode_ = mode as string;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const colorSchemeProperty = mode_ === 'dark' || mode_ === 'light' ? `\n  color-scheme: ${mode_};\n` : '';
    const textColor = '  color: var(--ds-color-neutral-text-default);';

    const formattedTokens = dictionary.allTokens.map(format).join('\n');
    const content = `{\n${formattedTokens}\n${colorSchemeProperty}${textColor}\n}\n`;
    const autoSelectorContent = ['light', 'dark'].includes(mode_) ? prefersColorScheme(mode_, content) : '';
    const body = R.isNotNil(layer)
      ? `@layer ${layer} {\n${selector} ${content} ${autoSelectorContent}\n}\n`
      : `${selector} ${content} ${autoSelectorContent}\n`;

    return header + body;
  },
};

const calculatedVariable = R.pipe(R.split(/:(.*?);/g), (split) => `${split[0]}: calc(${R.trim(split[1])});`);

export const semantic: Format = {
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

export const typography: Format = {
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

    console.log('dictionary.allTokens', dictionary.allTokens);

    const filteredTokens = R.reject(typographyFontFamilyPredicate, dictionary.allTokens);

    const formattedTokens = R.pipe(R.map(format), R.join('\n'))(filteredTokens);

    const content = selector ? `${selector} {\n${formattedTokens}\n}` : formattedTokens;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}` : content;

    return header + body;
  },
};
