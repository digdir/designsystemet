import {
  configSchema,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
  formatThemeCSS,
} from '@digdir/designsystemet/internal';
import { useEffect, useState } from 'react';

type ThemeConfig = ExternalConfigSchemaInput['themes'][string];

/** Wait for typing in the theme name to settle before generating, as generating the CSS takes a moment. */
const DEBOUNCE_MS = 300;

/**
 * Generates the CSS for a theme the same way the CLI does, by validating it like a config file and
 * running it through `formatThemeCSS`.
 */
const generateThemeCss = async (name: string, themeConfig: ThemeConfig) => {
  // Validate against the public schema first, then fill in the internal defaults, like the CLI and Figma plugin.
  const externalConfig = externalConfigSchema.parse({
    themes: { [name]: themeConfig },
  });
  const config = configSchema.parse(externalConfig);

  const files = await formatThemeCSS(
    { name, ...config.themes[name] } as Parameters<typeof formatThemeCSS>[0],
    { verbose: false, tailwind: false },
  );

  return files.map((file) => file.output).join('\n');
};

/**
 * The CSS file for the theme. Only generated while `enabled`, e.g. when the modal is open,
 * and regenerated when the theme changes.
 */
export const useThemeCss = (
  name: string,
  themeConfig: ThemeConfig,
  enabled: boolean,
) => {
  const [css, setCss] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // The config object is recreated on every render, so compare it by value.
  const themeKey = JSON.stringify(themeConfig);

  useEffect(() => {
    if (!enabled || !name) {
      return;
    }

    // Ignore results from a generation that a newer theme has replaced.
    let isCurrent = true;
    setIsGenerating(true);

    const timeout = setTimeout(() => {
      generateThemeCss(name, JSON.parse(themeKey) as ThemeConfig)
        .then((result) => {
          if (isCurrent) {
            setCss(result);
            setError(null);
          }
        })
        .catch((err: unknown) => {
          console.error('Could not generate theme CSS', err);
          if (isCurrent) {
            setError(err instanceof Error ? err : new Error(String(err)));
          }
        })
        .finally(() => {
          if (isCurrent) {
            setIsGenerating(false);
          }
        });
    }, DEBOUNCE_MS);

    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [name, themeKey, enabled]);

  return { css, isGenerating, error };
};
