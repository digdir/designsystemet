import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter, usesReferences } from 'style-dictionary/utils';

const calculatedVariable = R.pipe(R.split(/:(.*?);/g), (split) => `${split[0]}: calc(${R.trim(split[1])});`);

export const cssVariables: Format = {
  name: 'ds/css-variables',
  format: async function ({ dictionary, file, options, platform }) {
    const { allTokens } = dictionary;
    const { outputReferences, usesDtcg } = options;
    const { selector, baseTypes } = platform;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const formatTokens = R.map((token: TransformedToken) => {
      const originalValue = (usesDtcg ? token.original.$value : token.original.value) as string;
      const type = (usesDtcg ? token.$type : token.type) || '';

      if (
        usesReferences(originalValue) &&
        typeof outputReferences === 'function' &&
        outputReferences?.(token, { dictionary })
      ) {
        if ((baseTypes as string[]).includes(type)) {
          return calculatedVariable(format(token));
        }
      }

      return format(token);
    });

    const formattedVariables = formatTokens(allTokens);

    return header + `${selector} {\n${formattedVariables.join('\n')}\n}\n`;
  },
};
