import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src', './bin'],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: 'esm',
  bundle: true,
  platform: 'node',
  target: 'esnext',
  loader: {
    '.md': 'copy',
    '.json': 'file',
  },
});
