/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';
import { beforeAll } from 'vitest';

// Polyfill missing HTMLDocument to Document inheritance in HappyDOM
// TODO: This should be document in a "testing" section for consumers who use HappyDOM to run tests
if (
  typeof HTMLDocument !== 'undefined' &&
  !(HTMLDocument.prototype instanceof Document)
) {
  // Use try/catch to avoid cyclic dependency
  try {
    Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);
  } catch (_) {}
}

// Polyfill for HTMLDialogElement methods in JSDOM
beforeAll(() => {
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
