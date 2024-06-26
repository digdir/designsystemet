import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bin/designsystemet.ts', 'src/**/*.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['esm'],
  cjsInterop: true,
  treeshake: false,
  dts: true,
});
