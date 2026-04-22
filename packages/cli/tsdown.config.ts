import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/**/*.ts', './bin/**/*.ts', '!./src/scripts/**'],
  unbundle: true,
  sourcemap: false,
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  root: './',
  dts: false,
  fixedExtension: false,
  clean: true,
});
