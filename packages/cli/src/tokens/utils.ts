import * as R from 'ramda';
import type { Tokens } from 'style-dictionary';
import type { DesignToken, TransformedToken } from 'style-dictionary/types';
import type { TokenSet } from './types.js';

const mapToLowerCase = R.map<string, string>(R.toLower);

const hasAnyTruth = R.any(R.equals(true));

/**
 * Returns type based on design token format used. Read more:https://v4.styledictionary.com/info/dtcg/
 * @param token Transformed token
 * @returns type
 */
export const getType = (token: TransformedToken) => ((token.$type ?? token.type) as string) || '';

/**
 * Returns value based on design token format used. Read more:https://v4.styledictionary.com/info/dtcg/
 *
 * Use generic (`<T>`) to define return value type
 * @param token Transformed or Design token
 * @returns value
 */
export const getValue = <T>(token: TransformedToken | DesignToken): T => (token.$value ?? token.value) as T;

/**
 * Check if token type matches provided type
 * This function is curried
 * @param types Type or array of types to check against
 * @param token Transformed token
 * @returns boolean
 */
export const typeEquals = R.curry((types: string[] | string, token: TransformedToken) => {
  if (R.isNil(token)) {
    return false;
  }

  return R.includes(R.toLower(getType(token)), R.map(R.toLower, Array.isArray(types) ? types : [types]));
});

export const pathStartsWithOneOf = R.curry((paths: string[], token: TransformedToken) => {
  if (R.isNil(token)) {
    return false;
  }

  const tokenPath = mapToLowerCase(token.path);
  const matchPathsStartingWith = R.map((path) => R.startsWith([path], tokenPath), mapToLowerCase(paths));

  return hasAnyTruth(matchPathsStartingWith);
});

export function isSemanticToken(token: TransformedToken): boolean {
  return token.filePath.includes('semantic/');
}

export function isSemanticColorToken(token: TransformedToken, color: string): boolean {
  return token.filePath.includes('semantic/') && R.startsWith(['color', color], token.path);
}

export function isGlobalColorToken(token: TransformedToken): boolean {
  return typeEquals('color', token) && pathStartsWithOneOf(['global'], token);
}

export function isColorCategoryToken(token: TransformedToken, category?: 'main' | 'support'): boolean {
  if (!category) {
    return (['main', 'support'] as const).some((c) => isColorCategoryToken(token, c));
  }
  return R.startsWith(['color', category], token.path);
}

export const isDigit = (s: string) => /^\d+$/.test(s);

/**
 * @param {Tokens} obj
 * @param {(obj: Tokens|Token, key: keyof Tokens|Token, slice: Tokens|Token|string) => void} fn
 */
export function traverseObj(
  obj: Tokens | TokenSet,
  fn: (obj: TokenSet | Tokens | DesignToken, key: keyof Tokens | string, slice: Tokens | DesignToken | string) => void,
) {
  for (const key in obj) {
    const prop = obj[key];
    if (prop != null) {
      fn.apply(null, [obj, key, prop]);
      if (typeof prop === 'object') {
        traverseObj(prop, fn);
      }
    }
  }
  return obj;
}
