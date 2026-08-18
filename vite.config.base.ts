import { copyFileSync, globSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import type { Plugin, PluginOption, UserConfig } from 'vite';

/**
 * Shared Vite configuration for this monorepo.
 *
 * Every package builds with Vite. This file holds the parts they all agree on;
 * each package imports what it needs and extends it with `mergeConfig`. It is
 * the build-tooling counterpart to `tsconfig.base.json`.
 *
 * Deliberately dependency-free apart from `vite` itself — packages pass their
 * own plugins in (see the `dts` option) so each resolves its own copy.
 */

type PackageJson = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const escapeForRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Marks a package's dependencies — and every submodule of them — as external,
 * so they are never bundled into our own output.
 *
 * `extra` covers dependencies that are used but not declared in package.json.
 */
export function externalsFor(
  pkg: PackageJson,
  extra: string[] = [],
): (string | RegExp)[] {
  const names = [
    ...extra,
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ];

  return [
    ...names,
    ...names.map((name) => new RegExp(`^${escapeForRegex(name)}/`)),
  ];
}

/**
 * Expands glob patterns into a Rolldown input record, keyed by the module path
 * without its extension, so `preserveModules` mirrors the source tree in `dist`.
 *
 * Patterns are relative to `root`; prefix a pattern with `!` to exclude it.
 */
export function entriesFrom(root: string, patterns: string[]) {
  const include = patterns.filter((pattern) => !pattern.startsWith('!'));
  const exclude = patterns
    .filter((pattern) => pattern.startsWith('!'))
    .map((pattern) => pattern.slice(1));

  const files = globSync(include, { cwd: root, exclude }).sort();

  return Object.fromEntries(
    files.map((file) => [
      file.replace(/\.[cm]?tsx?$/, ''),
      path.join(root, file),
    ]),
  );
}

type LibOutput = {
  format: 'es' | 'cjs' | 'umd';
  /** Output directory, relative to the package root. */
  dir: string;
  /** Extension for emitted files. Defaults to `js`. */
  ext?: 'js' | 'cjs' | 'mjs';
  /** UMD only: global variable the bundle is exposed as. */
  name?: string;
  /**
   * Emit one file per source module instead of bundling. Defaults to `true`,
   * except for `umd`, which cannot preserve modules.
   */
  preserveModules?: boolean;
  /** Escape hatch for output naming; takes precedence over `ext`. */
  entryFileNames?: string | ((chunk: { name: string }) => string);
};

type LibOptions = {
  /** Absolute path to the package directory — pass `import.meta.dirname`. */
  root: string;
  /** The package's own package.json, used to derive externals. */
  pkg: PackageJson;
  /**
   * Entry module(s), relative to `root`. A string array is treated as glob
   * patterns (see {@link entriesFrom}); prefix with `!` to exclude.
   */
  entry: string | string[] | Record<string, string>;
  outputs: LibOutput[];
  /** Module ids to externalize on top of the package's own dependencies. */
  external?: string[];
  /**
   * Bundle dependencies into the output instead of externalizing them. Only for
   * self-contained builds such as UMD, where no module loader is available to
   * resolve them at runtime.
   */
  bundleDependencies?: boolean;
  /**
   * Directory entry paths are made relative to when preserving modules.
   * Defaults to `src`; use `.` when entries span several top-level directories.
   */
  preserveModulesRoot?: string;
  /**
   * Empty the first output directory before writing. Only covers `outputs[0]`,
   * so packages that write several directories should clean in their `build`
   * script instead.
   */
  clean?: boolean;
  banner?: string;
  minify?: boolean;
  sourcemap?: boolean;
  target?: string;
  platform?: 'browser' | 'node' | 'neutral';
  /** Additional Vite plugins for this package. */
  plugins?: PluginOption[];
  /**
   * Declaration-file plugins, e.g. `dts()` from `rolldown-plugin-dts`. Passing
   * these also excludes `.js` and `.d.ts` from Oxc transformation, which the
   * plugin requires so it does not reprocess its own output.
   */
  dts?: PluginOption[];
};

/**
 * Builds a package as a library: externalized dependencies, no HTML entry, and
 * one file per source module so consumers can tree-shake.
 */
export function defineLibConfig({
  root,
  pkg,
  entry,
  outputs,
  external = [],
  bundleDependencies = false,
  preserveModulesRoot = 'src',
  clean = false,
  banner,
  minify = false,
  sourcemap = false,
  target = 'es2022',
  platform = 'browser',
  plugins = [],
  dts,
}: LibOptions): UserConfig {
  const entries = Array.isArray(entry) ? entriesFrom(root, entry) : entry;

  return {
    root,
    // The dts plugin emits `.d.ts` and `.js` that must not be transformed again.
    ...(dts ? { oxc: { exclude: [/\.js$/, /\.d\.[cm]?ts$/] } } : {}),
    plugins: [...plugins, ...(dts ?? [])],
    build: {
      target,
      minify,
      sourcemap,
      // Off by default: each output writes to its own `dir`, and emptying only
      // covers `outDir`, so packages with several outputs must clean themselves.
      emptyOutDir: clean,
      outDir: outputs[0].dir,
      // Vite applies browser resolve conditions unless a build is marked as SSR,
      // which silently replaces `node:*` builtins with an empty-object shim. Node
      // libraries must opt out; browser libraries use library mode as usual.
      ...(platform === 'node' ? { ssr: true } : { lib: { entry: entries } }),
      rolldownOptions: {
        platform,
        ...(platform === 'node' ? { input: entries } : {}),
        ...(bundleDependencies
          ? {}
          : { external: externalsFor(pkg, external) }),
        output: outputs.map(
          ({
            format,
            dir,
            ext = 'js',
            name,
            preserveModules = format !== 'umd',
            entryFileNames = `[name].${ext}`,
          }) => ({
            format,
            dir: path.resolve(root, dir),
            name,
            banner,
            entryFileNames,
            // Set per output: supplying an explicit `output` array replaces the
            // one Vite would have derived `build.minify` into.
            minify,
            ...(preserveModules
              ? { preserveModules: true, preserveModulesRoot }
              : {}),
            // CJS consumers expect named exports rather than a namespace object.
            ...(format === 'cjs' ? { exports: 'named' as const } : {}),
          }),
        ),
      },
    },
  };
}

type AppOptions = {
  /** Absolute path to the app directory — pass `import.meta.dirname`. */
  root: string;
  /** Vite's `command`, so dev-only resolution can be applied. */
  command: 'serve' | 'build';
  /** True while Vite is building the server bundle. */
  isSsrBuild?: boolean;
  /**
   * The app's plugins, including `reactRouter()`. Passed in rather than
   * imported here so each app resolves its own pinned `@react-router/dev`.
   */
  plugins: PluginOption[];
  /** Entry for the SSR build. Defaults to `./server/app.ts`. */
  ssrEntry?: string;
};

/** Absolute path to `internal/components`, shared by the react-router apps. */
const internalComponentsDir = path.resolve(
  import.meta.dirname,
  'internal/components',
);

/**
 * Shared configuration for the react-router apps (`apps/www`,
 * `apps/themebuilder`).
 */
export function defineAppConfig({
  root,
  command,
  isSsrBuild,
  plugins,
  ssrEntry = './server/app.ts',
}: AppOptions): UserConfig {
  return {
    root,
    plugins,
    build: {
      rolldownOptions: isSsrBuild ? { input: ssrEntry } : undefined,
    },
    // In dev, resolve @internal/components to its source so edits hot-reload.
    // In build mode, fall back to normal package resolution via node_modules so
    // peer-dep resolution stays correct.
    resolve: {
      tsconfigPaths: true,
      ...(command === 'serve'
        ? { alias: { '@internal/components': internalComponentsDir } }
        : {}),
    },
    ssr: {
      noExternal: ['@navikt/aksel-icons', 'ramda'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router'],
    },
    oxc: {
      jsx: {
        runtime: 'automatic',
      },
    },
  };
}

/**
 * Copies files into the output directory once the bundle is written.
 *
 * For the handful of hand-written declaration files we ship as-is, which are not
 * part of any module graph. Sources and destinations are relative to `root`.
 */
export function copyFiles(
  root: string,
  files: { src: string; dest: string }[],
): Plugin {
  return {
    name: 'designsystemet:copy-files',
    closeBundle() {
      for (const { src, dest } of files) {
        const to = path.resolve(root, dest);
        mkdirSync(path.dirname(to), { recursive: true });
        copyFileSync(path.resolve(root, src), to);
      }
    },
  };
}
