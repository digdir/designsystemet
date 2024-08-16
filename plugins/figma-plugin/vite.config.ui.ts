import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import richSvg from 'vite-plugin-react-rich-svg';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => ({
  plugins: [react(), richSvg(), viteSingleFile()],
  root: path.resolve('src/ui'),
  build: {
    minify: mode === 'production',
    cssMinify: mode === 'production',
    sourcemap: mode !== 'production' ? 'inline' : false,
    emptyOutDir: false,
    outDir: path.resolve('dist'),
    rollupOptions: {
      input: path.resolve('src/ui/index.html'),
    },
  },
  resolve: {
    alias: {
      '@common': path.resolve('src/common'),
      '@ui': path.resolve('src/ui'),
    },
  },
}));
