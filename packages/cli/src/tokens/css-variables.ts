import { kebabCase } from './process/utils/kebab-case.ts';

/**
 * The single source of truth for the CSS custom property name a design token is output as by `tokens build`.
 *
 * Both the Style Dictionary build and the Figma plugin (which sets the WEB code syntax on variables) derive
 * names from this module, so the two can not drift apart. `css-variables.test.ts` asserts that the names this
 * module produces for the generated tokens are exactly the `--ds-*` properties present in the built CSS.
 */

export const CSS_VARIABLE_PREFIX = 'ds';

export type CssVariableNameOptions = {
  /**
   * Name the token as it is output inside a `[data-color="<name>"]` scope, where the color name is left out:
   * `color.accent.background-default` becomes `--ds-color-background-default` instead of
   * `--ds-color-accent-background-default`. Only meaningful for `semantic/style` color tokens.
   */
  colorScoped?: boolean;
};

const TOKEN_SET = {
  semanticStyle: /(^|\/)semantic\/style$/,
  semanticColor: /(^|\/)semantic\/color\/[^/]+$/,
  theme: /(^|\/)themes\/[^/]+$/,
  sizeGlobal: /(^|\/)primitives\/modes\/size\/global$/,
  typographySize: /(^|\/)primitives\/modes\/typography\/size\/[^/]+$/,
};

const THEME_GROUPS = ['font-family', 'font-weight', 'border-radius'];
const TYPOGRAPHY_SIZE_GROUPS = ['font-size', 'letter-spacing', 'line-height'];

/**
 * A token set reference as either the in-memory set path (`semantic/style`) or the Style Dictionary `filePath`
 * of a set read from disk (`./design-tokens/semantic/style.json`).
 */
const normalizeTokenSet = (tokenSet: string) => tokenSet.replaceAll('\\', '/').replace(/\.json$/, '');

/**
 * Joins name segments the way Style Dictionary's `name/kebab` transform does, so `_size`, `2xl` and `fontSize`
 * come out as `size`, `2xl` and `font-size`. See `kebab-case.test.ts` for the parity cases.
 */
export const toCssVariableSegments = (segments: readonly string[]): string => kebabCase(segments.join(' '));

/**
 * The CSS custom property `tokens build` outputs for a token, e.g. `--ds-border-radius-sm`, or `null` when the
 * token is never output as its own property (referenced primitives, theme color scales, inlined sizes, ...).
 *
 * @param path The token path within its set, e.g. `['color', 'accent', 'background-default']`.
 * @param tokenSet The set the token belongs to, e.g. `semantic/style`, or the Style Dictionary `filePath`.
 */
export function cssVariableName(
  path: readonly string[],
  tokenSet: string,
  { colorScoped = false }: CssVariableNameOptions = {},
): string | null {
  const set = normalizeTokenSet(tokenSet);
  const [group] = path;
  let segments: readonly string[] | null = null;

  if (TOKEN_SET.semanticStyle.test(set)) {
    if (group === 'size') {
      segments = null; // Inlined into the tokens that reference them, see the `size` format.
    } else if (group === 'typography') {
      // Typography components are expanded per property, and the group is left out of the name:
      // `typography.heading.xl.fontSize` -> `--ds-heading-xl-font-size`. The font-family is never output.
      segments = path.at(-1) === 'fontFamily' ? null : path.slice(1);
    } else if (group === 'color' && colorScoped && path.length > 2) {
      segments = ['color', ...path.slice(2)];
    } else {
      segments = path;
    }
  } else if (TOKEN_SET.semanticColor.test(set)) {
    // `semantic/color/<name>` holds the values behind the color-scoped properties, e.g. `background-default`
    // is what `--ds-color-background-default` resolves to inside `[data-color="<name>"]`.
    segments = ['color', ...path];
  } else if (TOKEN_SET.theme.test(set)) {
    // The numbered border-radius steps are inlined into the semantic tokens that reference them.
    const isInlinedStep = group === 'border-radius' && /^\d+$/.test(path[1] ?? '');
    segments = THEME_GROUPS.includes(group) && !isInlinedStep ? path : null;
  } else if (TOKEN_SET.sizeGlobal.test(set)) {
    segments = path; // `_size.4` -> `--ds-size-4`
  } else if (TOKEN_SET.typographySize.test(set)) {
    segments = TYPOGRAPHY_SIZE_GROUPS.includes(group) ? path : null;
  }

  if (!segments) return null;
  return `--${toCssVariableSegments([CSS_VARIABLE_PREFIX, ...segments])}`;
}
