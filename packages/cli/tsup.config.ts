import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src', './bin/designsystemet.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: 'esm',
  bundle: false,
  platform: 'node',
  target: 'esnext',
  loader: {
    '.md': 'copy',
    '.json': 'copy',
  },
});
