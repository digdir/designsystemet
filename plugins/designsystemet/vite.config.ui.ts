import path from 'node:path';
import react from '@vitejs/plugin-react';
import postcssUrl from 'postcss-url';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), viteSingleFile()],
  root: path.resolve('src/ui'),
  build: {
    minify: mode === 'production',
    cssMinify: mode === 'production',
    sourcemap: mode !== 'production' ? 'inline' : false,
    emptyOutDir: false,
    outDir: path.resolve('dist'),
    rolldownOptions: {
      input: path.resolve('src/ui/index.html'),
      output: {
        codeSplitting: false,
      },
    },
  },
  css: {
    postcss: {
      plugins: [postcssUrl({ url: 'inline' })],
    },
  },
}));
