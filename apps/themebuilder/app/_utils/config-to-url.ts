import {
  type ExternalConfigSchemaInput as ConfigSchema,
  severityColors,
} from '@digdir/designsystemet/internal';

const QUERY_SEPARATOR = ' ';

const severityNames = Object.keys(severityColors) as Array<
  keyof typeof severityColors
>;

/**
 * Converts a theme config object to a themebuilder URL with query parameters.
 *
 * Severity colors are optional and are in `colors` in the config. In the URL they have their own parameters:
 * `severity` for the ones that aren't the default color, and `severity-removed` for the ones the theme doesn't have.
 */
export function configThemeToUrl(
  theme: Pick<
    NonNullable<ConfigSchema['themes']>[string],
    'colors' | 'overrides' | 'borderRadius'
  >,
  lang = 'no',
): string {
  const params = new URLSearchParams();

  // Convert colors (a flat record of name -> hex), without the severity colors
  const colors = Object.entries(theme.colors || {})
    .filter(([name]) => !Object.hasOwn(severityColors, name))
    .map(([name, hex]) => `${name}:${hex}`)
    .join(QUERY_SEPARATOR);
  if (colors) params.set('colors', colors);

  // Severity colors that aren't the default color
  const changedSeverity = severityNames
    .filter((name) => {
      const hex = theme.colors?.[name];
      return hex && hex.toLowerCase() !== severityColors[name].toLowerCase();
    })
    .map((name) => `${name}:${theme.colors?.[name]}`)
    .join(QUERY_SEPARATOR);
  if (changedSeverity) params.set('severity', changedSeverity);

  // Severity colors the theme doesn't have
  const removedSeverity = severityNames
    .filter((name) => !theme.colors?.[name])
    .join(QUERY_SEPARATOR);
  if (removedSeverity) params.set('severity-removed', removedSeverity);

  // Convert color overrides to URL params
  if (theme.overrides?.colors) {
    // patterns: <colorname>|<tokenname>|<mode>:<hex>
    const colorOverrides = Object.entries(theme.overrides.colors)
      .map(([colorName, tokenObj]) =>
        Object.entries(
          tokenObj as Record<string, { light?: string; dark?: string }>,
        )
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
  params.set('tab', 'colorsystem');

  return `/${lang}?${params.toString()}`;
}
