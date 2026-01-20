import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'rolldown';

// Get all .ts files in src directory for individual file outputs
const srcDir = './src';
const files = readdirSync(srcDir).filter((file) => file.endsWith('.ts'));
const inputs = files.reduce((acc, file) => {
  const name = file.replace('.ts', '');
  acc[name] = join(srcDir, file);
  return acc;
}, {});

export default defineConfig([
  // ES Module build with individual files
  {
    input: inputs,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      entryFileNames: '[name].js',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    external: [
      '@floating-ui/dom',
      '@u-elements/u-combobox',
      '@u-elements/u-datalist',
      '@u-elements/u-details',
      '@u-elements/u-progress',
      '@u-elements/u-tabs',
      'invokers-polyfill',
    ],
  },
  // CommonJS build with individual files
  {
    input: inputs,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      entryFileNames: '[name].cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    external: [
      '@floating-ui/dom',
      '@u-elements/u-combobox',
      '@u-elements/u-datalist',
      '@u-elements/u-details',
      '@u-elements/u-progress',
      '@u-elements/u-tabs',
      'invokers-polyfill',
    ],
  },
]);
