import { resolve } from 'node:path';
import { parse } from 'tsconfck';
/// <reference types="vitest" />
import { defineProject } from 'vitest/config';

// Resolve the test-specific tsconfig file, including "extends".
// This is necessary because Vitest doesn't support specifying which tsconfig to use when
// setting esbuild options, as `test.typecheck.tsconfig` is only used for type testing
const { tsconfig } = await parse(
  resolve(import.meta.dirname, 'tsconfig.tests.json'),
);

export default defineProject({
  esbuild: {
    tsconfigRaw: JSON.stringify(tsconfig),
  },
  test: {
    typecheck: { tsconfig: 'tsconfig.tests.json' },
    globals: true,
    environment: 'jsdom',
    setupFiles: '../../test/vitest.setup.ts',
  },
});
