import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

/** The color scheme the site is currently shown in, kept up to date as the reader switches. */
export const useColorScheme = () => {
  const location = useLocation();
  const [colorScheme, setColorScheme] = useState<string | null>('dark');

  useEffect(() => {
    const root = document.documentElement;
    setColorScheme(root.getAttribute('data-color-scheme'));

    const observer = new MutationObserver(() => {
      setColorScheme(root.getAttribute('data-color-scheme'));
    });
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-color-scheme'],
    });

    return () => observer.disconnect();
  }, [location]);

  return colorScheme;
};
