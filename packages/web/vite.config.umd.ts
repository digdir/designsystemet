/**
 * A single self-contained bundle for consumers loading the components straight
 * from a `<script>` tag.
 *
 * Separate from the ESM/CJS build because UMD has to be one file, and because
 * dependencies must be bundled in here — there is no module loader to resolve
 * them at runtime. `external` is an input-level option, so one build cannot both
 * externalize and inline the same dependencies.
 */
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist/umd',
    // The JS and declaration builds also write under dist; clearing it is the
    // build script's job, not any single Vite run's.
    emptyOutDir: false,
    lib: {
      entry: './src/index.ts',
      // Required by umd: the global the bundle is exposed as.
      name: 'Designsystemet',
      formats: ['umd'],
      fileName: () => 'index.js',
    },
    rolldownOptions: {
      // Per-output rather than `build.minify`/`build.sourcemap`: an explicit
      // `output` replaces the one Vite derives those into.
      output: { minify: true, sourcemap: true },
    },
  },
});
