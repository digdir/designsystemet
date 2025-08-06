import { addons } from 'storybook/manager-api';
import customTheme from './customThemeLight';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

addons.setConfig({
  theme: customTheme,
  sidebar: {
    showRoots: true,
  },
  toolbar: {
    managerColorScheme: { hidden: true },
  },
});

// Use Storybook's globals system for manager-preview communication
const COLOR_SCHEME_GLOBAL = 'managerColorScheme';

// Function to get system preferred color scheme
const getSystemPreferredScheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

// Function to get current color scheme
const getCurrentScheme = () => {
  return (
    document.body.getAttribute('data-color-scheme') ||
    getSystemPreferredScheme()
  );
};

// Function to set the color scheme on the body
const setColorScheme = (scheme: string) => {
  document.body.setAttribute('data-color-scheme', scheme);
  console.log('Manager: Set body color scheme to:', scheme);
};

// Update global state when color scheme changes
const updateColorSchemeGlobal = (scheme: string) => {
  console.log('Manager: Updating color scheme global to:', scheme);

  // Use the channel to emit a global update event
  const channel = addons.getChannel();
  channel.emit('updateGlobals', {
    globals: {
      [COLOR_SCHEME_GLOBAL]: scheme,
    },
  });
};

// Watch for changes to the color scheme attribute
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'data-color-scheme') {
      const newScheme = getCurrentScheme();
      console.log('Manager: Color scheme changed to:', newScheme);
      updateColorSchemeGlobal(newScheme);
    }
  });
});

// Set up initial state and start observing
const initializeColorSchemeSync = () => {
  // Check if body already has a color scheme set
  const existingScheme = document.body.getAttribute('data-color-scheme');

  let initialScheme: string;

  if (existingScheme) {
    // Use existing scheme if already set
    initialScheme = existingScheme;
    console.log('Manager: Found existing color scheme:', initialScheme);
  } else {
    // Set to system preference if none exists
    initialScheme = getSystemPreferredScheme();
    setColorScheme(initialScheme);
    console.log(
      'Manager: Set initial color scheme to system preference:',
      initialScheme,
    );
  }

  // Set initial global value
  updateColorSchemeGlobal(initialScheme);

  // Start observing changes
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-color-scheme'],
  });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeColorSchemeSync);
} else {
  initializeColorSchemeSync();
}
