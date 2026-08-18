import { defineConfig } from 'vite';
import { defineLibConfig } from '../../vite.config.base.ts';
import postcssConfig from '../css/postcss.config.js';
import pkg from './package.json' with { type: 'json' };

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

export default defineConfig(({ command }) => {
  // `pnpm start` serves index.html as a scratch page for the web components,
  // using the same PostCSS pipeline as the CSS package so styles behave alike.
  if (command === 'serve') {
    return {
      root: import.meta.dirname,
      css: { postcss: postcssConfig },
    };
  }

  // Every module reachable from the entry is emitted individually, which is what
  // makes the per-component subpath exports in package.json resolvable.
  return defineLibConfig({
    root: import.meta.dirname,
    pkg,
    entry: './src/index.ts',
    minify: true,
    sourcemap: true,
    outputs: [
      { format: 'es', dir: 'dist/esm', entryFileNames: entryFileNames('js') },
      { format: 'cjs', dir: 'dist/cjs', entryFileNames: entryFileNames('cjs') },
    ],
  });
});
