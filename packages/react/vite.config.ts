import fs from 'node:fs';
import path from 'node:path';
import { dts } from 'rolldown-plugin-dts';
import { defineConfig, type Plugin } from 'vite';
import pkg from './package.json' with { type: 'json' };

/**
 * The build runs three times (see the build script):
 * - default mode:   ESM runtime + .d.ts     -> dist/esm
 * - mode 'cjs':     CJS runtime             -> dist/cjs
 * - mode 'cjs-dts': .d.cts declarations     -> dist/cjs
 *
 * rolldown-plugin-dts can only generate declarations in ES-format builds,
 * so the CJS declarations come from a separate ES build with `emitDtsOnly`,
 * named with .cjs/.d.cts extensions.
 */

const dependencies = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies,
});

/* Regexes to correctly mark submodules from dependencies (e.g. react/jsx-runtime) as external */
const dependenciesSubmodules = dependencies.map(
  (dep) => new RegExp(`^${dep}/`),
);

/* Add 'use client' to every emitted JS module, but never to declaration files */
const useClientBanner = (chunk: { fileName: string }) =>
  /\.d\.c?ts$/.test(chunk.fileName) ? '' : "'use client';";

/* Declaration chunks are named `foo.d` — give them .ts/.cts, runtime chunks .js/.cjs */
const fileNames =
  (jsExt: 'js' | 'cjs', dtsExt: 'ts' | 'cts') => (chunk: { name: string }) =>
    chunk.name.endsWith('.d') ? `[name].${dtsExt}` : `[name].${jsExt}`;

/* The `./react-types` export — copied next to the emitted types so its
   relative import of ./types.js resolves */
const copyReactTypes = (): Plugin => ({
  name: 'copy-react-types',
  writeBundle() {
    const outDir = path.resolve(import.meta.dirname, 'dist/esm');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, 'react-types.d.ts'),
      fs
        .readFileSync(
          path.resolve(import.meta.dirname, 'react-types.d.ts'),
          'utf8',
        )
        .replace("from './types'", "from './types.js'"),
    );
  },
});

export default defineConfig(({ mode }) => ({
  // Exclude the generated declaration modules from Oxc transformation, per
  // the rolldown-plugin-dts README (oxc.exclude overrides the default list,
  // so .js must be re-added)
  oxc: {
    exclude: [/\.js$/, /\.d\.[cm]?ts$/],
  },
  plugins:
    mode === 'cjs'
      ? []
      : [
          ...dts({
            tsconfig: './tsconfig.lib.json',
            emitDtsOnly: mode === 'cjs-dts',
          }),
          ...(mode === 'cjs-dts' ? [] : [copyReactTypes()]),
        ],
  build: {
    lib: {
      entry: {
        // colors is a separate entry because index does not import it —
        // it backs the type-only `./colors` export in package.json
        index: './src/index.ts',
        colors: './src/colors.ts',
      },
      formats: [mode === 'cjs' ? 'cjs' : 'es'],
    },
    minify: false,
    sourcemap: false,
    // The clean script empties dist; emptying here would clobber earlier passes
    emptyOutDir: false,
    rolldownOptions: {
      external: [...dependencies, ...dependenciesSubmodules],
      output: {
        format: mode === 'cjs' ? 'cjs' : 'es',
        dir: mode === 'cjs' || mode === 'cjs-dts' ? 'dist/cjs' : 'dist/esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames:
          mode === 'cjs' || mode === 'cjs-dts'
            ? fileNames('cjs', 'cts')
            : fileNames('js', 'ts'),
        chunkFileNames:
          mode === 'cjs' || mode === 'cjs-dts'
            ? fileNames('cjs', 'cts')
            : fileNames('js', 'ts'),
        banner: useClientBanner,
        ...(mode === 'cjs' ? { exports: 'named' as const } : {}),
      },
    },
  },
}));
