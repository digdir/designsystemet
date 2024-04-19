import type { Transform } from 'style-dictionary/types';

import { noCase } from './noCase.js';

export const sizeRem: Transform = {
  name: 'fds/size/toRem',
  type: 'value',
  transitive: true,
  matcher: (token) =>
    ['sizing', 'spacing'].includes(token.type as string) &&
    !token.name.includes('base'),
  transformer: (token, options) => {
    const baseFont = options.basePxFontSize || 16;
    const value = parseInt(token.value as string);

    if (value === 0) {
      return '0';
    }

    return `${value / baseFont}rem`;
  },
};

export const nameKebab: Transform = {
  name: 'name/cti/hierarchical-kebab',
  type: 'name',
  transformer: (token, options) => {
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
  matcher: (token) => token.type === 'typography',
  transformer: (token, config, options) => {
    const { usesDtcg } = options;
    const typography = (usesDtcg ? token.$value : token.value) as Typgraphy;

    const baseFontPx = config?.basePxFontSize || 16;
    const fontSize = `${parseInt(typography.fontSize) / baseFontPx}rem`;

    return `${typography.fontWeight} ${fontSize}/${typography.lineHeight} '${typography.fontFamily}'`;
  },
};
