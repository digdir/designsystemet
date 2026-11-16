/**
 * The URL parameters that held the theme before it moved to the theme store.
 * Links with them are still read, on the server, by `legacy-url.server.ts`.
 */
export const legacyThemeKeys = [
  'config',
  'theme',
  'colors',
  'severity',
  'severity-enabled',
  'color-overrides',
  'border-radius',
  'main',
  'support',
  'neutral',
];
