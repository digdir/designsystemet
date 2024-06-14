import * as R from 'ramda';
import type { TransformedToken } from 'style-dictionary';
import type { Format } from 'style-dictionary/types';
import { fileHeader, createPropertyFormatter, usesReferences } from 'style-dictionary/utils';

import type { IsCalculatedToken } from '../configs';
import { getValue } from '../utils/utils';

const calculatedVariable = R.pipe(R.split(/:(.*?);/g), (split) => `${split[0]}: calc(${R.trim(split[1])});`);

export const cssVariables: Format = {
  name: 'ds/css-variables',
  format: async function ({ dictionary, file, options, platform }) {
    const { allTokens } = dictionary;
    const { outputReferences } = options;
    const { selector, isCalculatedToken } = platform;

    const header = await fileHeader({ file });

    const format = createPropertyFormatter({
      outputReferences,
      dictionary,
      format: 'css',
    });

    const formatTokens = R.map((token: TransformedToken) => {
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
    });

    const formattedVariables = formatTokens(allTokens);

    return header + `${selector} {\n${formattedVariables.join('\n')}\n}\n`;
  },
};
