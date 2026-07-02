import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    minify: mode === 'production',
    sourcemap: mode !== 'production' ? 'inline' : false,
    target: 'es2022',
    outDir: path.resolve('dist'),
    emptyOutDir: false,
    rolldownOptions: {
      input: path.resolve('src/code/code.ts'),
      output: {
        codeSplitting: false,
        entryFileNames: '[name].js',
      },
    },
  },
}));
