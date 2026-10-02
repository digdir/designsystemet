import type { ExternalConfigSchemaInput } from '@digdir/designsystemet/internal';
import { useEffect, useState } from 'react';

type ThemeConfig = ExternalConfigSchemaInput['themes'][string];

/** Wait for typing in the theme name to settle before generating, as generating the CSS takes a moment. */
const DEBOUNCE_MS = 300;

/**
 * Loaded on first use: generating CSS needs Style Dictionary, which is too large for the initial page load.
 */
const generateThemeCss = async (name: string, themeConfig: ThemeConfig) => {
  const { generateThemeCss } = await import('./generate-theme-css');
  return generateThemeCss(name, themeConfig);
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
