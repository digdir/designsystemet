import { dts } from 'rolldown-plugin-dts';
import { defineConfig } from 'vite';
import { defineLibConfig } from '../../vite.config.base.ts';
import pkg from './package.json' with { type: 'json' };

/**
 * Entry patterns shared by the JS build and the declaration build, so both emit
 * the same set of modules. `src/scripts` holds build-time scripts that are run
 * directly from source and are not published.
 */
const entry = ['src/**/*.ts', 'bin/**/*.ts', '!src/scripts/**'];

export default defineConfig(
  defineLibConfig({
    root: import.meta.dirname,
    pkg,
    entry,
    // Entries span both `src/` and `bin/`, so mirror from the package root.
    preserveModulesRoot: '.',
    platform: 'node',
    // Single output directory, so Vite can clear it itself.
    clean: true,
    target: 'esnext',
    outputs: [{ format: 'es', dir: 'dist' }],
    dts: dts({ entry }),
  }),
);
