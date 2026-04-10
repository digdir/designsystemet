import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'rolldown';

// Mark all dependencies as external
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const external = Object.keys(pkg.dependencies).map(
  (name) => new RegExp(`^${name}(/.*)?`),
);

// Get all .ts files in src directory for individual file outputs
const srcDir = './src';
const files = readdirSync(srcDir).filter((file) => file.endsWith('.ts'));
const input = files.reduce((acc, file) => {
  const name = file.replace('.ts', '');
  acc[name] = join(srcDir, file);
  return acc;
}, {});

const entryFileNames =
  (ext) =>
  ({ name }) =>
    name.includes('node_modules')
      ? `_vendors${name.split('node_modules').pop()}.js` // Jest does not resolve invokers-polyfill/fn so instead we inline it
      : `[name].${ext}`;

export default defineConfig([
  // ES Module build with individual files
  {
    input,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      // See https://github.com/rollup/rollup/issues/3684#issuecomment-1535836196
      entryFileNames: entryFileNames('js'),
      // Needed to truly enable being treeshakable when Vite is in lib mode
      // https://stackoverflow.com/questions/74362685/tree-shaking-does-not-work-in-vite-library-mode
      preserveModules: true,
      preserveModulesRoot: 'src',
      minify: true,
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
      // See https://github.com/rollup/rollup/issues/3684#issuecomment-1535836196
      entryFileNames: entryFileNames('cjs'),
      // Needed to truly enable being treeshakable when Vite is in lib mode
      // https://stackoverflow.com/questions/74362685/tree-shaking-does-not-work-in-vite-library-mode
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
      minify: true,
    },
    external,
  },
  // UMD format for browsers
  {
    input: './src/index.ts',
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      name: 'Designsystemet',
      sourcemap: true,
      minify: true,
    },
  },
]);
