import { useEffect, useState } from 'react';
import type { WorkspaceTheme } from '~/model/theme-workspace';

/**
 * Loaded on first use: generating CSS needs Style Dictionary, which is too large for the initial page load.
 */
const generateThemeCss = async (name: string, theme: WorkspaceTheme) => {
  const { generateThemeCss } = await import('./generate-theme-css');
  return generateThemeCss(name, theme);
};

/**
 * The CSS file for a theme. Only generated while `enabled`, e.g. when the modal is open,
 * and regenerated when the theme changes.
 */
export const useThemeCss = (
  name: string,
  theme: WorkspaceTheme,
  enabled: boolean,
) => {
  const [css, setCss] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Ignore results from a generation that a newer theme has replaced.
    let isCurrent = true;
    setCss('');
    setError(null);
    setIsGenerating(true);

    generateThemeCss(name, theme)
      .then((result) => {
        if (isCurrent) setCss(result);
      })
      .catch((err: unknown) => {
        console.error('Could not generate theme CSS', err);
        if (isCurrent)
          setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (isCurrent) setIsGenerating(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [name, theme, enabled]);

  return { css, isGenerating, error };
};
