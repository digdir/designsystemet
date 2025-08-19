import { addons } from 'storybook/manager-api';
import customTheme from './customThemeLight';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

const COLOR_SCHEME_GLOBAL = 'managerColorScheme';

addons.setConfig({
  theme: customTheme,
  sidebar: {
    showRoots: true,
  },
  toolbar: {
    managerColorScheme: { hidden: true },
  },
});

const getSystemPreferredScheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getCurrentScheme = () => {
  return (
    document.body.getAttribute('data-color-scheme') ||
    getSystemPreferredScheme()
  );
};

const setColorScheme = (scheme: string) => {
  document.body.setAttribute('data-color-scheme', scheme);
};

// Update global state when color scheme changes
const updateColorSchemeGlobal = (scheme: string) => {
  const channel = addons.getChannel();
  channel.emit('updateGlobals', {
    globals: {
      [COLOR_SCHEME_GLOBAL]: scheme,
    },
  });
};

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'data-color-scheme') {
      const newScheme = getCurrentScheme();
      updateColorSchemeGlobal(newScheme);
    }
  });
});

const initializeColorSchemeSync = () => {
  // Check if body already has a color scheme set
  const existingScheme = document.body.getAttribute('data-color-scheme');

  let initialScheme: string;

  if (existingScheme) {
    initialScheme = existingScheme;
  } else {
    initialScheme = getSystemPreferredScheme();
    setColorScheme(initialScheme);
  }

  updateColorSchemeGlobal(initialScheme);

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-color-scheme'],
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeColorSchemeSync);
} else {
  initializeColorSchemeSync();
}
