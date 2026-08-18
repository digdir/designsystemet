import { defineConfig } from 'vite';
import { copyFiles, defineLibConfig } from '../../vite.config.base.ts';
import pkg from './package.json' with { type: 'json' };

const root = import.meta.dirname;

/**
 * Declarations are emitted separately by `tsc -b tsconfig.lib.json` straight into
 * `dist/types`, which is why this build only produces JavaScript. TypeScript is
 * the right tool there: it already knows about the project references and the
 * ambient types this package relies on.
 */
export default defineConfig(
  defineLibConfig({
    root,
    pkg,
    entry: './src/index.ts',
    // Used by the components but not declared as dependencies, since consumers
    // pull them in themselves.
    external: ['@digdir/designsystemet-css', '@digdir/design-system-tokens'],
    // Every component is a separate module so consumers can tree-shake, and each
    // is marked as a client component for React Server Components consumers.
    banner: "'use client';",
    outputs: [
      { format: 'es', dir: 'dist/esm' },
      { format: 'cjs', dir: 'dist/cjs' },
    ],
    plugins: [
      // Hand-written declarations that are shipped as-is.
      copyFiles(root, [
        { src: 'react-types.d.ts', dest: 'dist/react-types.d.ts' },
      ]),
    ],
  }),
);
