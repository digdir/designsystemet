import type { ConfigSchemaTheme } from '@digdir/designsystemet';

const QUERY_SEPARATOR = ' ';

/**
 * Converts a theme config object to a themebuilder URL with query parameters
 */
export function configThemeToUrl(
  theme: ConfigSchemaTheme,
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

  // Convert border radius
  if (theme.borderRadius !== undefined) {
    params.set('border-radius', theme.borderRadius.toString());
  }

  // Set default appearance
  params.set('appearance', 'light');
  params.set('tab', 'overview');

  return `/${lang}/themebuilder?${params.toString()}`;
}
