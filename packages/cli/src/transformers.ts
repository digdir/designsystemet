import type {
  Transform,
  TransformedToken,
  TransformedTokens,
} from 'style-dictionary/types';
import { transformDimension } from '@tokens-studio/sd-transforms';

import { noCase } from './noCase.js';

export const sizePx: Transform = {
  name: 'fds/size/px',
  type: 'value',
  transitive: true,
  matcher: (token) =>
    ['sizing', 'spacing'].includes(token.type as string) &&
    !token.name.includes('base'),
  transformer: (token) => transformDimension(token.value as number),
};

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

export const nameKebabUnderscore: Transform = {
  name: 'name/cti/camel_underscore',
  type: 'name',
  transformer: function (token, options) {
    return noCase([options?.prefix].concat(token.path).join(' '), {
      delimiter: '_',
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

export const calc: Transform = {
  name: 'fds/calc',
  type: 'value',
  transitive: true,
  matcher: (token) =>
    (token.type === 'spacing' && token.path[0] === 'spacing') ||
    (token.type === 'sizing' && token.path[0] === 'sizing'),
  transformer: (token) => {
    const value = token.value as string;

    return `calc(${value})`;
  },
};

type FontScale = {
  min: TransformedToken;
  max: TransformedToken;
  v: TransformedToken;
  r: TransformedToken;
  fluid: TransformedToken;
};

let fontScale: TransformedTokens;

export const fluidFontSize: Transform = {
  name: 'css/fontSizes/fluid',
  type: 'value',
  transitive: true,
  matcher: (token) =>
    token.type === 'fontSizes' &&
    token.path[0] === 'font-size' &&
    token.path[1].startsWith('f'),
  transformer: (token, options) => {
    if (fontScale) {
      const baseFontPx = options?.basePxFontSize || 1;

      const scale = fontScale[token.path[1]] as unknown as FontScale;

      const { min, max, v, r } = scale;
      const minRem = (parseFloat(min.value as string) / baseFontPx).toFixed(2);
      const maxRem = (parseFloat(max.value as string) / baseFontPx).toFixed(2);
      const fontR = (parseFloat(r.value as string) / baseFontPx).toFixed(2);
      const fontV = parseFloat(v.value as string).toFixed(2);

      const fluid = `clamp(${minRem}rem, calc(${fontV}vw + ${fontR}rem), ${maxRem}rem)`;

      return fluid;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return token.value;
  },
};
