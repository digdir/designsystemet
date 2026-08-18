import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

const root = import.meta.dirname;

/**
 * Dependencies, and any submodule of them, stay external so consumers resolve a
 * single copy. `@digdir/designsystemet-css` is used by the components but is only
 * a devDependency here, since consumers import the stylesheet themselves.
 */
const external = [
  '@digdir/designsystemet-css',
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
].flatMap((name) => [name, new RegExp(`^${name}/`)]);

/**
 * Shared by both formats: one output file per source module so consumers can
 * tree-shake, each marked as a client component for React Server Components.
 */
const output = {
  preserveModules: true,
  preserveModulesRoot: 'src',
  banner: "'use client';",
  entryFileNames: '[name].js',
} as const;

export default defineConfig({
  build: {
    target: 'es2022',
    minify: false,
    outDir: 'dist/esm',
    // `tsc -b tsconfig.lib.json` has already written declarations into
    // dist/types by the time this runs, so this build must not clear dist.
    emptyOutDir: false,
    lib: { entry: './src/index.ts' },
    rolldownOptions: {
      external,
      output: [
        { ...output, format: 'es', dir: 'dist/esm' },
        { ...output, format: 'cjs', dir: 'dist/cjs', exports: 'named' },
      ],
    },
  },
  plugins: [
    {
      // Hand-written declarations shipped as-is; not part of any module graph.
      name: 'designsystemet:copy-react-types',
      closeBundle() {
        copyFileSync(
          path.resolve(root, 'react-types.d.ts'),
          path.resolve(root, 'dist/react-types.d.ts'),
        );
      },
    },
  ],
});
