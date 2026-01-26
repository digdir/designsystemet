import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'rolldown';
import { dependencies } from './package.json';

// Mark all dependencies as external
const external = Object.keys(dependencies);

// Get all .ts files in src directory for individual file outputs
const srcDir = './src';
const files = readdirSync(srcDir).filter((file) => file.endsWith('.ts'));
const input = files.reduce((acc, file) => {
  const name = file.replace('.ts', '');
  acc[name] = join(srcDir, file);
  return acc;
}, {});

export default defineConfig([
  // ES Module build with individual files
  {
    input,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      entryFileNames: '[name].js',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    external,
  },
  // CommonJS build with individual files
  {
    input,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      entryFileNames: '[name].cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
    },
    external,
  },
]);
