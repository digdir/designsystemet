import type { TestingLibraryMatchers } from '@testing-library/jest-dom';

declare module 'vi' {
  interface Assertion<T> extends TestingLibraryMatchers<T> {}
}
