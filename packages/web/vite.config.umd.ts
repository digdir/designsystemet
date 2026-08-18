import { defineConfig } from 'vite';

/**
 * A single self-contained bundle for consumers loading the components straight
 * from a `<script>` tag. Built separately from the ESM/CJS outputs because UMD
 * cannot preserve modules — it has to be one file.
 *
 * Dependencies are bundled in rather than externalized, since there is no module
 * loader to resolve them at runtime.
 */
export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    outDir: 'dist/umd',
    emptyOutDir: false,
    lib: {
      entry: './src/index.ts',
      name: 'Designsystemet',
      formats: ['umd'],
      fileName: () => 'index.js',
    },
    rolldownOptions: {
      output: { minify: true },
    },
  },
});
