import { generateConfigFromCSS } from '@digdir/designsystemet/internal';
import pkg from '@digdir/designsystemet/package.json';
import type { CssFile } from '../../types';

// Pasted CSS has no file name to name its theme, so it gets this one, which can be changed in the config.
const UNNAMED_THEME = 'theme';

/**
 * Creates a config from theme CSS built by Designsystemet (e.g. designsystemet.css), as formatted JSON to import.
 * Each file is one theme. `tokens build` names each theme's CSS file after the theme, so a file's name names
 * its theme. Throws if a file isn't theme CSS, if two files name the same theme, if a file names a theme
 * `__proto__`, or if the themes don't make a valid config together (e.g. they define different colors).
 */
export function configFromCss(files: CssFile[]): {
  config: string;
  warnings: string[];
} {
  // A Map, so file names like `constructor.css` can't clash with properties every object has.
  const themes = new Map<string, string>();
  let hasUnnamedTheme = false;

  for (const { css, fileName } of files) {
    const fileTheme = themeNameFromFile(fileName);
    hasUnnamedTheme ||= !fileTheme;
    const themeName = fileTheme || UNNAMED_THEME;
    // The config schema drops a `__proto__` key, so the import would lose this theme without saying so.
    if (themeName === '__proto__') {
      throw new Error(
        `A theme can't be called "__proto__", as a config can't have a theme with that name. Rename ${fileName ?? 'the file'} to name the theme something else.`,
      );
    }
    if (themes.has(themeName)) {
      throw new Error(
        `More than one file is named for the theme "${themeName}". Each file is one theme, named after the file, so rename the files to tell them apart.`,
      );
    }
    themes.set(themeName, css);
  }

  const { config, warnings } = generateConfigFromCSS(
    Object.fromEntries(themes),
  );
  if (hasUnnamedTheme) {
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

/** The theme a file is named for, e.g. `designsystemet.css` → `designsystemet`. */
function themeNameFromFile(fileName: string | undefined): string | undefined {
  return (
    fileName
      ?.replace(/\.css$/i, '')
      // Browsers add e.g. " (1)" to a downloaded file whose name is taken.
      .replace(/\s*\(\d+\)$/, '')
      .trim() || undefined
  );
}
