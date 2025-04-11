import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vi' {
  interface Assertion<T> extends TestingLibraryMatchers<T> {}
}
