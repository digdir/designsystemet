import type { TestingLibraryMatchers } from '@testing-library/jest-dom';
import type { Assertion } from 'vitest';

declare module 'vi' {
  interface Assertion<T> extends TestingLibraryMatchers<T> {}
}
