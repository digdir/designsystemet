import * as R from 'ramda';
import type { Format } from 'style-dictionary/types';
import { createPropertyFormatter } from 'style-dictionary/utils';
import { inlineTokens } from '../../../utils.js';
import { isInlineTokens } from './size.js';

export const semantic: Format = {
  name: 'ds/css-semantic',
  format: async ({ dictionary, options, platform }) => {
    const { outputReferences, usesDtcg } = options;
    const { selector, layer } = platform;

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
      usesDtcg,
    });

    const tokens = inlineTokens(isInlineTokens, dictionary.allTokens);

    const formattedTokens = R.map(format, tokens).join('\n');

    const content = `${selector} {\n${formattedTokens}\n}\n`;
    const body = R.isNotNil(layer) ? `@layer ${layer} {\n${content}\n}\n` : `${content}\n`;

    return body;
  },
};
