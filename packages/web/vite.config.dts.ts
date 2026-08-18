import path from 'node:path';
import { dts } from 'rolldown-plugin-dts';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };
import { frameworkTypes } from './vite/framework-types.ts';

/**
 * Declarations are bundled into a single `dist/index.d.ts`, which every entry in
 * the `exports` map points at. Built separately from the JS because `emitDtsOnly`
 * discards the JS chunks, and because this writes to `dist` rather than
 * `dist/esm` and `dist/cjs`.
 */
const root = import.meta.dirname;

/**
 * Required, not merely an optimization: without it the `@u-elements` types get
 * inlined, tripling the file and duplicating global augmentations that would
 * then clash for consumers who depend on those packages directly.
 */
const external = Object.keys(pkg.dependencies).map(
  (name) => new RegExp(`^${name}(/.*)?`),
);

export default defineConfig({
  build: {
    minify: false,
    outDir: 'dist',
    emptyOutDir: false,
    // Only `es`; Vite's default for a single entry is ['es', 'umd'].
    lib: { entry: './src/index.ts', formats: ['es'] },
    rolldownOptions: {
      external,
      // The dts plugin renames the emitted chunk to `.d.ts`; Vite's lib-mode
      // default naming breaks that and `emitDtsOnly` then discards everything.
      output: { entryFileNames: '[name].js' },
    },
  },
  // The dts plugin emits `.d.ts` and `.js` that must not be transformed again.
  oxc: { exclude: [/\.js$/, /\.d\.[cm]?ts$/] },
  plugins: [
    ...dts({ emitDtsOnly: true }),
    frameworkTypes({
      srcDir: path.resolve(root, 'src'),
      dtsFile: path.resolve(root, 'dist/index.d.ts'),
    }),
  ],
});
