import { defineConfig } from 'vite';
import postcssConfig from '../css/postcss.config.js';
import pkg from './package.json' with { type: 'json' };

/**
 * Dependencies and their submodules are left for the consumer to resolve. A
 * predicate rather than regexes, since package names may contain
 * regex-significant characters.
 */
const dependencies = Object.keys(pkg.dependencies);
const external = (id: string) =>
  dependencies.some((dep) => id === dep || id.startsWith(`${dep}/`));

/**
 * Neither Jest nor some bundlers resolve `invokers-polyfill/fn` and
 * `popover-polyfill/fn`, so those two are inlined rather than externalized. Give
 * the resulting chunks a stable path instead of leaking `node_modules` into dist.
 */
const entryFileNames =
  (ext: string) =>
  ({ name }: { name: string }) =>
    name.includes('node_modules')
      ? `_vendors${name.split('node_modules').pop()}.${ext}`
      : `[name].${ext}`;

/**
 * Shared by both formats: every module reachable from the entry is emitted
 * individually, which is what makes the per-component subpath exports in
 * package.json resolvable.
 *
 * `minify` and `sourcemap` belong here rather than on `build`: an explicit
 * `output` replaces the one Vite derives those into, so setting them at build
 * level would silently have no effect.
 */
const output = {
  preserveModules: true,
  preserveModulesRoot: 'src',
  minify: true,
  sourcemap: true,
};

export default defineConfig(({ command }) => {
  // `pnpm start` serves index.html as a scratch page for the web components,
  // using the same PostCSS pipeline as the CSS package so styles behave alike.
  if (command === 'serve') {
    return { css: { postcss: postcssConfig } };
  }

  return {
    build: {
      target: 'es2022',
      outDir: 'dist',
      // The declaration and UMD builds also write under dist, so clearing it is
      // the build script's job, not any single Vite run's.
      emptyOutDir: false,
      // `formats` is explicit because Vite defaults a single entry to
      // ['es', 'umd'], and umd would then demand a `lib.name`.
      lib: { entry: './src/index.ts', formats: ['es', 'cjs'] },
      rolldownOptions: {
        external,
        // Each output places its own files; `outDir` above only anchors reporting.
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
