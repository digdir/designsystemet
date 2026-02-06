import { configure } from '@testing-library/react';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';
import '@digdir/designsystemet-css'; // Load CSS as some components rely on CSS custom properties for default texts
import '@digdir/designsystemet-web';

// Speed up by using instant animations/transitions during testing
document.head.appendChild(
  Object.assign(document.createElement('style'), {
    textContent: `*, *::before, *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    transition-delay: 0ms !important;
    animation-delay: 0ms !important;
  }`,
  }),
);

interface ImportMetaEnv {
  VITE_REACT_VERSION?: string;
}

declare global {
  interface ImportMeta {
    env: ImportMetaEnv;
  }
}
const expectedVersion = import.meta.env.VITE_REACT_VERSION;

if (expectedVersion) {
  if (!reactVersion.startsWith(expectedVersion)) {
    throw new Error(
      `Expected react v${expectedVersion}, but found v${reactVersion}`,
    );
  }
  if (!reactDomVersion.startsWith(expectedVersion)) {
    throw new Error(
      `Expected react-dom v${expectedVersion}, but found v${reactDomVersion}`,
    );
  }
} else {
  throw new Error('VITE_REACT_VERSION is not defined');
}

await Promise.all([
  customElements.whenDefined('ds-field'),
  customElements.whenDefined('ds-tabs'),
  customElements.whenDefined('ds-breadcrumbs'),
  customElements.whenDefined('ds-pagination'),
  customElements.whenDefined('ds-suggestion'),
  customElements.whenDefined('ds-error-summary'),
]);

configure({ reactStrictMode: true });
