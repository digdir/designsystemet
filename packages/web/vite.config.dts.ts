/**
 * Bundles all declarations into a single `dist/index.d.ts`, which every entry in
 * the `exports` map points at.
 *
 * Separate from the JS build for two reasons: `emitDtsOnly` discards the JS
 * chunks, and this writes to `dist` while the JS goes to `dist/esm` and
 * `dist/cjs`.
 */
import path from 'node:path';
import { dts } from 'rolldown-plugin-dts';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };
import { frameworkTypes } from './vite/framework-types.ts';

const root = import.meta.dirname;

/**
 * Load-bearing, not an optimization: without it the `@u-elements` declarations
 * get inlined, tripling the file and duplicating global augmentations that then
 * clash for consumers depending on those packages directly.
 */
const dependencies = Object.keys(pkg.dependencies);
const external = (id: string) =>
  dependencies.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default defineConfig({
  build: {
    outDir: 'dist',
    // The JS and UMD builds also write under dist; clearing it is the build
    // script's job, not any single Vite run's.
    emptyOutDir: false,
    // `formats` is explicit because Vite defaults a single entry to
    // ['es', 'umd'], and umd would then demand a `lib.name`.
    lib: { entry: './src/index.ts', formats: ['es'] },
    rolldownOptions: {
      external,
      // Load-bearing: the dts plugin derives the `.d.ts` name from the chunk
      // name, and Vite's lib-mode default naming makes `emitDtsOnly` discard
      // every chunk instead — leaving no declarations at all.
      output: { entryFileNames: '[name].js', minify: false },
    },
  },
  // The dts plugin emits `.d.ts` and `.js` that must not be transformed again.
  oxc: { exclude: [/\.js$/, /\.d\.[cm]?ts$/] },
  plugins: [
    ...dts({ emitDtsOnly: true }),
    // Appends the `ds-*` JSX typings, which no declaration generator can derive.
    frameworkTypes({
      srcDir: path.resolve(root, 'src'),
      dtsFile: path.resolve(root, 'dist/index.d.ts'),
    }),
  ],
});
