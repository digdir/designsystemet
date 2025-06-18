import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    treeshake: false,
    minify: true,
    /* verbose: true, */
    dts: true,
    external: ['react', 'react-dom'],
    clean: true,
    target: 'esnext',
    format: ['cjs'],
    outDir: '../../apps/www/app/sandpack-build',
    tsconfig: './tsconfig.lib.json',
  },
]);
