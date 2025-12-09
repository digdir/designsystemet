import type { ConfigSchema } from '@digdir/designsystemet';

const QUERY_SEPARATOR = ' ';

/**
 * Converts a theme config object to a themebuilder URL with query parameters
 */
export function configThemeToUrl(
  theme: ConfigSchema['themes']['default'],
  lang = 'no',
): string {
  const params = new URLSearchParams();

  // Convert main colors
  if (theme.colors.main) {
    const mainColors = Object.entries(theme.colors.main)
      .map(([name, hex]) => `${name}:${hex}`)
      .join(QUERY_SEPARATOR);
    params.set('main', mainColors);
  }

  // Convert neutral color
  if (theme.colors.neutral) {
    params.set('neutral', theme.colors.neutral);
  }

  // Convert support colors
  if (theme.colors.support && Object.keys(theme.colors.support).length > 0) {
    const supportColors = Object.entries(theme.colors.support)
      .map(([name, hex]) => `${name}:${hex}`)
      .join(QUERY_SEPARATOR);
    params.set('support', supportColors);
  }

  // Convert severity colors if overridden
  if (theme.overrides?.severity) {
    const severityColors = Object.entries(theme.overrides.severity)
      .map(([name, hex]) => `${name}:${hex}`)
      .join(QUERY_SEPARATOR);
    params.set('severity', severityColors);
    params.set('severity-enabled', 'true');
  }

  // Convert color overrides to URL params
  if (theme.overrides?.colors) {
    // patterns: <colorname>|<tokenname>|<mode>:<hex>
    const colorOverrides = Object.entries(theme.overrides.colors)
      .map(([colorName, tokenObj]) =>
        Object.entries(tokenObj)
          .map(([tokenname, modeObj]) => {
            let paramStr = `${colorName}|${tokenname}`;
            if (modeObj.light) {
              paramStr += `|light:${modeObj.light}`;
            }
            if (modeObj.dark) {
              paramStr += `|dark:${modeObj.dark}`;
            }
            return paramStr;
          })
          .join(QUERY_SEPARATOR),
      )
      .join(QUERY_SEPARATOR);
    params.set('color-overrides', colorOverrides);
  }

  // Convert border radius
  if (theme.borderRadius !== undefined) {
    params.set('border-radius', theme.borderRadius.toString());
  }

  // Set default appearance
  params.set('appearance', 'light');
  params.set('tab', 'overview');

  return `/${lang}/themebuilder?${params.toString()}`;
}
