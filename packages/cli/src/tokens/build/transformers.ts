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

type Typgraphy = {
  fontWeight: string;
  fontSize: string;
  lineHeight: number;
  fontFamily: string;
};

export const typographyShorthand: Transform = {
  name: 'typography/shorthand',
  type: 'value',
  transitive: true,
  filter: (token) => typeEquals('typography', token),
  transform: (token) => {
    const typography = getValue<Typgraphy>(token);
    return `${typography.fontWeight} ${typography.fontSize}/${typography.lineHeight} '${typography.fontFamily}'`;
  },
};

export const typographyName: Transform = {
  name: 'name/typography',
  type: 'name',
  transitive: true,
  filter: (token) => typeEquals('typography', token),
  transform: (token) => {
    return token.name.replace('-typography', '');
  },
};
