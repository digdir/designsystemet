import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src/index.ts'],
  unbundle: true,
  sourcemap: false,
  tsconfig: './tsconfig.lib.json',
  format: {
    esm: { outDir: 'dist/esm' },
    cjs: { outDir: 'dist/cjs' },
  },
  banner: { js: "'use client';" },
  platform: 'browser',
  target: 'baseline-widely-available',
  dts: true,
  fixedExtension: false,
  // react-types.d.ts imports './types', which must resolve to the emitted
  // dist/esm/types.d.ts — so the copy lives inside dist/esm
  copy: [{ from: './src/react-types.d.ts', to: './dist/esm' }],
});
