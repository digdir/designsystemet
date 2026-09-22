/**
 * Type declarations for the jest-dom matchers added in `vitest.setup.ts`.
 *
 * `@testing-library/jest-dom/vitest` declares these itself, but it augments
 * `Assertion` with a single type parameter while Vitest declares two. The
 * mismatch is silently dropped by `skipLibCheck`, leaving the matchers
 * untyped, so declare them here with the arity Vitest expects.
 *
 * Remove once https://github.com/testing-library/jest-dom/issues/738 is fixed.
 */
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  interface Matchers<R, T> extends TestingLibraryMatchers<unknown, R> {}
}
