import type { CssColor, SeverityColorNames } from '../colors/index.ts';

// Separate const defaults to avoid circular dependency issues with the Theme type
export const defaultFontFamily = 'Inter';
export const defaultBorderRadius = 4;
export const visitedLinkColor = '#663299';
/** The color whose background and text are the default focus colors. */
export const focusColor = '#24272B';

export const severityColors: Record<SeverityColorNames, CssColor> = {
  info: '#0A71C0',
  success: '#068718',
  warning: '#EA9B1B',
  danger: '#C01B1B',
};

export const severityColorNames = Object.keys(severityColors) as Array<keyof typeof severityColors>;

/** Non-severity colors first (in user order), then the theme's severity colors at the end in severityColors order.
 * Severity colors are optional: only the ones in `colors` are kept, none are added.
 *
 * We do this because we want severity colors to always be last when design-tokens are visualized in Token Studio and Figma Variables.
 */
export function sortSeverityColorsLast<T extends Record<string, string>>(colors: T): T {
  const result = new Map(Object.entries(colors));
  for (const name of Object.keys(severityColors)) {
    const userValue = result.get(name);
    if (userValue === undefined) continue;
    result.delete(name); // Deleting and re-adding moves the key to the end
    result.set(name, userValue);
  }
  return Object.fromEntries(result) as T;
}
