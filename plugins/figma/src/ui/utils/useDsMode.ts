import { useEffect, useState } from 'react';

export const useDsMode = () => {
  const [themeMode, setThemeMode] = useState('dark');

  /* observer for html element, that checks class for dark or light */
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          const htmlElement = document.querySelector('html');
          if (htmlElement) {
            if (htmlElement.classList.contains('figma-dark')) {
              setThemeMode('dark');
            } else {
              setThemeMode('light');
            }
          }
        }
      }
    });

    /* get initial theme from class */
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      if (htmlElement.classList.contains('figma-dark')) {
        setThemeMode('dark');
      } else {
        setThemeMode('light');
      }
    }

    if (htmlElement) {
      observer.observe(htmlElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return themeMode;
};
