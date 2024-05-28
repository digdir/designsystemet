import type { Assertion } from 'vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom';

declare module 'vi' {
  interface Assertion<T = any> extends TestingLibraryMatchers<T> {}
}
