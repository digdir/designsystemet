import { defineConfig } from 'vite';
import { defineLibConfig } from '../../vite.config.base.ts';
import pkg from './package.json' with { type: 'json' };

/**
 * A single self-contained bundle for consumers loading the components straight
 * from a `<script>` tag. Built separately from the ESM/CJS outputs because UMD
 * cannot preserve modules — it has to be one file.
 *
 * Dependencies are bundled in rather than externalized, since there is no module
 * loader to resolve them at runtime.
 */
export default defineConfig(
  defineLibConfig({
    root: import.meta.dirname,
    pkg,
    entry: './src/index.ts',
    minify: true,
    sourcemap: true,
    bundleDependencies: true,
    outputs: [
      {
        format: 'umd',
        dir: 'dist/umd',
        name: 'Designsystemet',
        entryFileNames: 'index.js',
      },
    ],
  }),
);
