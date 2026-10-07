import { generateConfigFromCSS } from '@digdir/designsystemet/internal';
import pkg from '@digdir/designsystemet/package.json';

// Pasted CSS has no file name to name its theme, so it gets this one, which can be changed in the config.
const UNNAMED_THEME = 'theme';

/**
 * Creates a config from theme CSS built by Designsystemet (e.g. designsystemet.css), as formatted JSON to import.
 * `tokens build` names each theme's CSS file after the theme, so an uploaded file's name names the theme.
 * Throws if the CSS isn't theme CSS.
 */
export function configFromCss(
  css: string,
  fileName?: string,
): { config: string; warnings: string[] } {
  // Browsers add e.g. " (1)" to a downloaded file whose name is taken.
  const fileTheme = fileName
    ?.replace(/\.css$/i, '')
    .replace(/\s*\(\d+\)$/, '')
    .trim();
  const themeName = fileTheme || UNNAMED_THEME;

  const { config, warnings } = generateConfigFromCSS({ [themeName]: css });
  if (!fileTheme) {
    warnings.unshift(
      `The CSS doesn't name its theme, so it's called "${UNNAMED_THEME}". Rename it in the config before importing if needed.`,
    );
  }

  return {
    config: `${JSON.stringify(
      {
        $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
        ...config,
      },
      null,
      2,
    )}\n`,
    warnings,
  };
}
