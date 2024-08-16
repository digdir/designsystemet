/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { rgbToHex } from '@common/utils';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const getVariables = async () => {
  const variables = await figma.variables.getLocalVariablesAsync();
  const arr = [];
  for (const variable of variables) {
    if (variable.name.startsWith('theme2')) {
      arr.push({
        name: variable.name.substring(7),
        value: rgbToHex(variable.valuesByMode['34811:0'] as RGB),
      });
    }
  }

  return arr;
};
