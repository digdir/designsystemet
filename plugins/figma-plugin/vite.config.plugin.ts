import path from 'node:path';

import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => ({
  plugins: [viteSingleFile()],
  build: {
    minify: mode === 'production',
    sourcemap: mode !== 'production' ? 'inline' : false,
    target: 'es2017',
    emptyOutDir: false,
    outDir: path.resolve('dist'),
    rollupOptions: {
      input: path.resolve('src/plugin/plugin.ts'),
      output: {
        entryFileNames: 'plugin.js',
      },
    },
  },
  resolve: {
    alias: {
      '@common': path.resolve('src/common'),
      '@plugin': path.resolve('src/plugin'),
    },
  },
}));
