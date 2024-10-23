import { checkAndEvaluateMath } from '@tokens-studio/sd-transforms';
import * as R from 'ramda';
import type { Transform } from 'style-dictionary/types';

import { noCase } from './utils/noCase.js';
import { getValue, pathStartsWithOneOf, typeEquals } from './utils/utils.js';

const isPx = R.test(/\b\d+px\b/g);

export const sizeRem: Transform = {
  name: 'ds/size/toRem',
  type: 'value',
  transitive: true,
  filter: (token) => {
    const hasWantedType = typeEquals(['dimension', 'fontsize'], token);
    const hasWantedPath = pathStartsWithOneOf(['spacing', 'sizing', 'border-radius', 'font-size'], token);

    return hasWantedType && hasWantedPath;
  },
  transform: (token, config) => {
    const value = getValue<string>(token);

    if (isPx(value)) {
      const baseFont = (config.basePxFontSize as unknown as number) || 16;
      const size = parseInt(value);

      if (size === 0) {
        return '0';
      }

      return `${size / baseFont}rem`;
    }
    return value;
  },
};

export const nameKebab: Transform = {
  name: 'name/cti/hierarchical-kebab',
  type: 'name',
  transform: (token, options) => {
    return noCase([options?.prefix].concat(token.path).join('-'), {
      delimiter: '-',
      stripRegexp: /[^A-Z0-9_]+/gi,
    });
  },
};

export const typographyName: Transform = {
  name: 'name/typography',
  type: 'name',
  transitive: true,
  // expanded tokens have different type so we match on path instead
  filter: (token) => pathStartsWithOneOf(['typography'], token),
  transform: (token) => {
    return token.name.replace('-typography', '');
  },
};

export const resolveMath: Transform = {
  name: 'ds/resolveMath',
  type: 'value',
  transitive: true,
  filter: (token) => {
    const isValidValue = ['string', 'object'].includes(typeof (token.$value ?? token.value));
    const isTokenOfInterest = !pathStartsWithOneOf(['border-radius'], token);

    return isValidValue && isTokenOfInterest;
  },
  transform: (token, platformCfg) => checkAndEvaluateMath(token, platformCfg.mathFractionDigits),
};
