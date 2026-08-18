import { defineConfig } from 'vite';
import postcssConfig from '../css/postcss.config.js';
import pkg from './package.json' with { type: 'json' };

/** Dependencies, and any submodule of them, stay external. */
const external = Object.keys(pkg.dependencies).map(
  (name) => new RegExp(`^${name}(/.*)?`),
);

/**
 * Neither Jest nor some bundlers resolve `invokers-polyfill/fn` and
 * `popover-polyfill/fn`, so those are inlined rather than externalized. Give the
 * resulting chunks a stable path instead of leaking `node_modules` into `dist`.
 */
const entryFileNames =
  (ext: string) =>
  ({ name }: { name: string }) =>
    name.includes('node_modules')
      ? `_vendors${name.split('node_modules').pop()}.${ext}`
      : `[name].${ext}`;

/**
 * Every module reachable from the entry is emitted individually, which is what
 * makes the per-component subpath exports in package.json resolvable.
 */
const output = {
  preserveModules: true,
  preserveModulesRoot: 'src',
  minify: true,
} as const;

export default defineConfig(({ command }) => {
  // `pnpm start` serves index.html as a scratch page for the web components,
  // using the same PostCSS pipeline as the CSS package so styles behave alike.
  if (command === 'serve') {
    return { css: { postcss: postcssConfig } };
  }

  return {
    build: {
      target: 'es2022',
      sourcemap: true,
      outDir: 'dist/esm',
      // The declaration and UMD builds write elsewhere under dist; cleaning is
      // the build script's job.
      emptyOutDir: false,
      lib: { entry: './src/index.ts' },
      rolldownOptions: {
        external,
        output: [
          {
            ...output,
            format: 'es',
            dir: 'dist/esm',
            entryFileNames: entryFileNames('js'),
          },
          {
            ...output,
            format: 'cjs',
            dir: 'dist/cjs',
            exports: 'named',
            entryFileNames: entryFileNames('cjs'),
          },
        ],
      },
    },
  };
});
