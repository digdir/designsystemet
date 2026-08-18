import { globSync } from 'node:fs';
import { dts } from 'rolldown-plugin-dts';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

/**
 * Entry patterns, shared by the JS and declaration outputs so both emit the same
 * set of modules. `src/scripts` holds build-time scripts that are run straight
 * from source and are not published.
 */
const entry = ['src/**/*.ts', 'bin/**/*.ts', '!src/scripts/**'];

/**
 * One entry per source module, keyed by its path without the extension, so that
 * `preserveModules` mirrors the source tree: `dist/src/**` and `dist/bin/**`.
 */
const input = Object.fromEntries(
  globSync(
    entry.filter((pattern) => !pattern.startsWith('!')),
    {
      cwd: import.meta.dirname,
      exclude: entry.filter((pattern) => pattern.startsWith('!')).map((pattern) => pattern.slice(1)),
    },
  )
    .sort()
    .map((file) => [file.replace(/\.ts$/, ''), `./${file}`]),
);

/** Dependencies, and any submodule of them, are resolved by Node at runtime. */
const external = Object.keys(pkg.dependencies).flatMap((name) => [name, new RegExp(`^${name}/`)]);

export default defineConfig({
  build: {
    // Vite applies browser resolve conditions unless a build is marked as SSR,
    // which silently replaces `node:*` builtins with an empty-object shim.
    ssr: true,
    target: 'esnext',
    minify: false,
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      input,
      platform: 'node',
      external,
      output: {
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: '.',
        entryFileNames: '[name].js',
      },
    },
  },
  // The dts plugin emits `.d.ts` and `.js` that must not be transformed again.
  oxc: { exclude: [/\.js$/, /\.d\.[cm]?ts$/] },
  // Emits a `.d.ts` next to each module, matching the JS layout.
  plugins: dts({ entry }),
});
