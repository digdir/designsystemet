/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';

// Import all web components
import './src/index';

// Wait for all custom elements to be defined
await Promise.all([
  customElements.whenDefined('ds-field'),
  customElements.whenDefined('ds-tabs'),
  customElements.whenDefined('ds-breadcrumbs'),
  customElements.whenDefined('ds-pagination'),
  customElements.whenDefined('ds-suggestion'),
  customElements.whenDefined('ds-error-summary'),
]);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = ''; // Clean up DOM between tests
});
