import path from 'node:path';
import { dts } from 'rolldown-plugin-dts';
import { defineConfig } from 'vite';
import { defineLibConfig } from '../../vite.config.base.ts';
import pkg from './package.json' with { type: 'json' };
import { frameworkTypes } from './vite/framework-types.ts';

/**
 * Declarations are bundled into a single `dist/index.d.ts`, which every entry in
 * the `exports` map points at. This runs as its own build because `emitDtsOnly`
 * discards the JS chunks, and because the declaration file lands in `dist` while
 * the JS builds write to `dist/esm` and `dist/cjs`.
 */
const root = import.meta.dirname;

export default defineConfig(
  defineLibConfig({
    root,
    pkg,
    entry: './src/index.ts',
    outputs: [{ format: 'es', dir: 'dist', preserveModules: false }],
    dts: [
      ...dts({ emitDtsOnly: true }),
      frameworkTypes({
        srcDir: path.resolve(root, 'src'),
        dtsFile: path.resolve(root, 'dist/index.d.ts'),
      }),
    ],
  }),
);
