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
export const typeEquals: (types: string[] | string, token: TransformedToken) => boolean = R.curry(
  (types: string[] | string, token: TransformedToken) => {
    if (R.isNil(token)) {
      return false;
    }

    return R.includes(R.toLower(getType(token)), R.map(R.toLower, Array.isArray(types) ? types : [types]));
  },
);

export const pathStartsWithOneOf: (paths: string[], token: TransformedToken) => boolean = R.curry(
  (paths: string[], token: TransformedToken) => {
    if (R.isNil(token)) {
      return false;
    }

    const tokenPath = mapToLowerCase(token.path);
    const matchPathsStartingWith = R.map((path) => R.startsWith([path], tokenPath), mapToLowerCase(paths));

    return hasAnyTruth(matchPathsStartingWith);
  },
);

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

/** Copied from Style Dictionary and added types
@see https://github.com/amzn/style-dictionary/blob/31c29df0382a61b085f6392dc3225c5009fbffc5/lib/utils/combineJSON.js#L33 */
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

/**
 * In the given tokens array, inline and remove tokens that match the predicate
 *
 * Example: In pseudo-code, given the predicate `(token) => token.path === ['size', '1']` and the following tokens
 * ```js
 *  [
 *    { path: ['size', 'base'], original: { $value: '8px' } },
 *    { path: ['size', '1'], original: { $value: '{size.base} * 2' } },
 *    { path: ['size', 'sm']: original: { $value: 'min({size.1}, 12px)' } }
 *  ]
 * ```
 * would return
 * ```js
 *  [
 *    { path: ['size', 'base'], original: { $value: '8px' } },
 *    { path: ['size', 'sm']: original: { $value: 'min({size.base} * 2, 12px)' } }
 *  ]
 * ```
 *
 * @param shouldInline - predicate to determine if token should be inlined
 * @param tokens - array of tokens to transform
 * @returns copy of `tokens` without those that matched the predicate,
 *          where references to the matching tokens have been inlined
 */
export function inlineTokens(shouldInline: (t: TransformedToken) => boolean, tokens: TransformedToken[]) {
  const [inlineableTokens, otherTokens] = R.partition(shouldInline, tokens);
  return otherTokens.map((token: TransformedToken) => {
    // Inline the tokens that satisfy shouldInline().
    let transformed = getValue<string>(token.original);
    for (const ref of inlineableTokens) {
      const refName = ref.path.join('.');

      if (typeof transformed === 'string') {
        transformed = transformed.replaceAll(`{${refName}}`, getValue<string>(ref.original));
      }
    }
    const tokenWithInlinedRefs = R.set(R.lensPath(['original', '$value']), transformed, token);
    return tokenWithInlinedRefs;
  });
}
