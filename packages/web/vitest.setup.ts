/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';

// The popover polyfill defines these methods as configurable, but not writable.
// Mirror that descriptor shape even in browsers with native popover support.
for (const name of ['togglePopover', 'showPopover', 'hidePopover'] as const) {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    name,
  );
  if (descriptor)
    Object.defineProperty(HTMLElement.prototype, name, {
      ...descriptor,
      writable: false,
    });
}

// Import all web components after configuring the popover method descriptors
await import('./src/index');
