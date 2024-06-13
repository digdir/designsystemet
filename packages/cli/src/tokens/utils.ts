import type { TransformedToken, DesignToken } from 'style-dictionary/types';

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
