import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

window.addEventListener('error', (event) => {
  console.error('UI error', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('UI promise rejection', event.reason);
});

// Follow Figma's own light/dark theme by mirroring it onto Designsystemet's data-color-scheme.
// Figma toggles a `figma-dark` / `figma-light` class on <html>; we also fall back to the OS
// preference, and keep watching so the plugin retracks when the user switches Figma's theme.
function syncColorScheme(): void {
  const root = document.documentElement;
  const isDark = root.classList.contains('figma-dark')
    ? true
    : root.classList.contains('figma-light')
      ? false
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
}

syncColorScheme();

new MutationObserver(syncColorScheme).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class'],
});

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing #root');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
