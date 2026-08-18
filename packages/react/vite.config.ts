import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

const root = import.meta.dirname;

/**
 * Dependencies and their submodules are left for the consumer to resolve, so no
 * second copy is bundled in. A predicate rather than regexes, since package names
 * may contain regex-significant characters.
 *
 * `@digdir/designsystemet-css` is only a devDependency here — consumers import
 * the stylesheet themselves — but must still never be bundled.
 */
const dependencies = [
  '@digdir/designsystemet-css',
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
];
const external = (id: string) =>
  dependencies.some((dep) => id === dep || id.startsWith(`${dep}/`));

/**
 * Shared by both formats: one output file per source module so consumers can
 * tree-shake, each marked as a client component for React Server Components.
 *
 * `minify` belongs here rather than on `build`: an explicit `output` replaces the
 * one Vite derives `build.minify` into, so setting it at build level would
 * silently have no effect.
 */
const output = {
  preserveModules: true,
  preserveModulesRoot: 'src',
  banner: "'use client';",
  entryFileNames: '[name].js',
  minify: false,
};

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    // Declarations are emitted separately, by `tsc -b tsconfig.lib.json` into
    // dist/types, so this build must never clear dist.
    emptyOutDir: false,
    // `formats` is explicit because Vite defaults a single entry to
    // ['es', 'umd'], and umd would then demand a `lib.name`.
    lib: { entry: './src/index.ts', formats: ['es', 'cjs'] },
    rolldownOptions: {
      external,
      // Each output places its own files; `outDir` above only anchors reporting.
      output: [
        { ...output, format: 'es', dir: 'dist/esm' },
        { ...output, format: 'cjs', dir: 'dist/cjs', exports: 'named' },
      ],
    },
  },
  plugins: [
    {
      // A hand-written declaration file, shipped as-is. It is not part of any
      // module graph, so nothing else would copy it into dist.
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
