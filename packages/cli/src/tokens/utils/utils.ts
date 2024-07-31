import * as R from 'ramda';
import type { DesignToken, TransformedToken } from 'style-dictionary/types';

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
