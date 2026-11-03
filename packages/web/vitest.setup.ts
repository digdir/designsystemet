/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { beforeAll } from 'vitest';

// Polyfill missing HTMLDocument to Document inheritance in HappyDOM
// TODO: This should be documented in a "testing" section for consumers who use HappyDOM to run tests
if (
  typeof HTMLDocument !== 'undefined' &&
  !(HTMLDocument.prototype instanceof Document)
) {
  // Use try/catch to avoid cyclic dependency
  try {
    Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);
  } catch (_) {}
}

// Firefox can drop the first focus() call while focus moves into a new test iframe,
// so move focus into the iframe once and wait until it sticks before running tests
beforeAll(async () => {
  const input = document.body.appendChild(document.createElement('input'));
  for (let i = 0; i < 10 && document.activeElement !== input; i++) {
    input.focus();
    await new Promise((resolve) => setTimeout(resolve));
  }
  input.remove();
});

// Polyfill for HTMLDialogElement methods in JSDOM
beforeAll(() => {
  if (typeof HTMLDialogElement.prototype.show === 'function') return; // No need to polyfill if supported
  HTMLDialogElement.prototype.show = function mock(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.showModal = function mock(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function mock(
    this: HTMLDialogElement,
    returnValue?: string,
  ) {
    this.open = false;
    if (returnValue !== undefined) this.returnValue = returnValue;
    this.dispatchEvent(new Event('close'));
  };
});

// Import all web components
import './src/index';
