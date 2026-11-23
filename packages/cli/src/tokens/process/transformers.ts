import { checkAndEvaluateMath } from '@tokens-studio/sd-transforms';
import * as R from 'ramda';
import type { Transform } from 'style-dictionary/types';
import { CSS_VARIABLE_PREFIX, cssVariableName, toCssVariableSegments } from '../css-variables.ts';
import { getValue, pathStartsWithOneOf, typeEquals } from '../utils.ts';

const isPx = R.test(/\b\d+px\b/g);

export const sizeRem: Transform = {
  name: 'ds/size/toRem',
  type: 'value',
  transitive: true,
  filter: (token) => {
    const hasWantedType = typeEquals(['dimension', 'fontsize'], token);
    const hasWantedPath = pathStartsWithOneOf(['border-radius', 'font-size' /*, ['_size', 'mode-font-size']*/], token);

    return hasWantedType && hasWantedPath;
  },
  transform: (token, config) => {
    const value = getValue<string>(token);

    if (isPx(value)) {
      const baseFont = (config.basePxFontSize as unknown as number) || 16;
      const size = parseInt(value, 10);

      if (size === 0) {
        return '0';
      }

      return `${size / baseFont}rem`;
    }
    return value;
  },
};

/**
 * Names tokens with the shared {@link cssVariableName} rules so the CSS output and the Figma plugin agree.
 * Tokens that are never output as a CSS property keep Style Dictionary's plain kebab name for reference resolution.
 */
export const dsName: Transform = {
  name: 'ds/name',
  type: 'name',
  transform: (token, config) => {
    const prefix = config.prefix ?? CSS_VARIABLE_PREFIX;
    const name = cssVariableName(token.path, token.filePath ?? '');
    return name ? name.slice(2) : toCssVariableSegments([prefix, ...token.path]);
  },
};

export const resolveMath: Transform = {
  name: 'ds/resolveMath',
  type: 'value',
  transitive: true,
  filter: (token) => {
    const isValidValue = ['string', 'object'].includes(typeof getValue(token));
    const isTokenOfInterest = !pathStartsWithOneOf(['border-radius'], token);

    return isValidValue && isTokenOfInterest;
  },
  transform: (token, platformCfg) => checkAndEvaluateMath(token, platformCfg.mathFractionDigits),
};

export const unitless: Transform = {
  name: 'ds/unitless',
  type: 'value',
  transitive: true,
  filter: (token) => pathStartsWithOneOf(['size', '_size'], token),
  transform: (token) => parseInt(getValue<string>(token), 10),
};
