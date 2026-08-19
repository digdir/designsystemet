import { globSync } from 'node:fs';
import { dts } from 'rolldown-plugin-dts';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

const root = import.meta.dirname;

/** `src/scripts` holds build-time scripts, run from source and never published. */
const include = ['src/**/*.ts', 'bin/**/*.ts'];
const exclude = ['src/scripts/**'];

/**
 * One entry per source module, keyed by its path without the extension, so that
 * `preserveModules` mirrors the source tree: `dist/src/**` and `dist/bin/**`.
 */
const input = Object.fromEntries(
  globSync(include, { cwd: root, exclude })
    .sort()
    .map((file) => [file.replace(/\.ts$/, ''), `./${file}`]),
);

/**
 * Dependencies and their submodules are resolved by Node at runtime. A predicate
 * rather than regexes, since package names may contain regex-significant
 * characters (`colorjs.io`).
 */
const dependencies = Object.keys(pkg.dependencies);
const external = (id: string) => dependencies.some((dep) => id === dep || id.startsWith(`${dep}/`));

export default defineConfig({
  build: {
    // Vite applies browser resolve conditions unless a build is marked as SSR,
    // which silently replaces `node:*` builtins with an empty-object shim.
    ssr: true,
    target: 'esnext',
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
        // Deliberately per-output, not `build.minify`/`build.sourcemap`: an
        // explicit `output` replaces the one Vite derives those into, so setting
        // them at build level would silently have no effect.
        minify: false,
        sourcemap: false,
      },
    },
  },
  // The dts plugin emits `.d.ts` and `.js` that must not be transformed again.
  oxc: { exclude: [/\.js$/, /\.d\.[cm]?ts$/] },
  // A `.d.ts` beside each emitted module, matching the JS layout.
  plugins: dts({
    cwd: root,
    entry: [...include, ...exclude.map((pattern) => `!${pattern}`)],
  }),
});
