import { cssVariableName } from '../tokens/css-variables.ts';
import type { FigmaVariableToken } from './scopes.ts';

/**
 * The WEB code syntax Figma shows for a variable, e.g. `var(--ds-border-radius-sm)`, or null when
 * the token has no CSS property. Whether a token has one is decided by {@link cssVariableName},
 * the same rules `tokens build` names its output with, so the syntax can not drift from the CSS.
 *
 * @param token The token path and the token set it belongs to, e.g. `semantic/style`.
 */
export function figmaCodeSyntax(token: Pick<FigmaVariableToken, 'path'> & { tokenSet: string }): string | null {
  const cssVariable = cssVariableName(token.path, token.tokenSet);
  return cssVariable ? `var(${cssVariable})` : null;
}
