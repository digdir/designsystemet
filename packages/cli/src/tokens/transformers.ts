import type { Transform } from 'style-dictionary/types';

import { noCase } from './noCase.js';

export const sizeRem: Transform = {
  name: 'fds/size/toRem',
  type: 'value',
  transitive: true,
  filter: (token) => ['sizing', 'spacing'].includes(token.type as string) && !token.name.includes('base'),
  transform: (token, config, options) => {
    const { usesDtcg } = options;

    const value = (usesDtcg ? token.$value : token.value) as string;
    const baseFont = (config.basePxFontSize as unknown as number) || 16;
    const size = parseInt(value);

    if (size === 0) {
      return '0';
    }

    return `${size / baseFont}rem`;
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
  filter: (token) => token.type === 'typography',
  transform: (token, config, options) => {
    const { usesDtcg } = options;
    const typography = (usesDtcg ? token.$value : token.value) as Typgraphy;

    const baseFontPx = (config.basePxFontSize as unknown as number) || 16;
    const fontSize = `${parseInt(typography.fontSize) / baseFontPx}rem`;

    return `${typography.fontWeight} ${fontSize}/${typography.lineHeight} '${typography.fontFamily}'`;
  },
};
