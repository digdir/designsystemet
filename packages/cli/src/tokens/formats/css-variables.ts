import type { Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter } from 'style-dictionary/utils';

/**
 *  CSS variables format with option to include source references for matched token through `options.referencesFilter`
 */
export const cssVariables: Format = {
  name: 'ds/css-variables',
  format: async function ({ dictionary, file, options, platform }) {
    const { allTokens } = dictionary;
    const { outputReferences } = options;
    const { selector } = platform;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const tokens = allTokens.map(format);

    return `
${header}
${selector} {
${tokens.join('\n')}
}\n`;
  },
};
