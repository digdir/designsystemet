import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/**/*.ts', './bin/**/*.ts', '!./src/scripts/**', '!./src/**/*.test.ts'],
  unbundle: true,
  sourcemap: false,
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  root: './',
  dts: true,
  fixedExtension: false,
  clean: true,
});
