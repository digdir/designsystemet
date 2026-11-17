import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

const contentDir = fileURLToPath(new URL('./app/content', import.meta.url));

const internalComponentsDir = fileURLToPath(
  new URL('../../internal/components', import.meta.url),
);

function mdxFullReload() {
  return {
    name: 'mdx-full-reload',
    // biome-ignore lint/suspicious/noExplicitAny: We dont have types for server
    handleHotUpdate({ file, server }: { file: string; server: any }) {
      if (file.endsWith('.mdx')) {
        server.ws.send({ type: 'full-reload', path: '*' });
      }
    },
  };
}

/**
 * Content refers to icons by name: `icon:` in frontmatter, and the live examples that run the code
 * in *.stories.tsx / *.dodont.tsx. Looking those names up in all of '@navikt/aksel-icons' ships
 * the whole icon set (about 1.3 MB) to the browser, so these virtual modules re-export only the
 * icons the content uses. A name that isn't an icon fails the build.
 *
 * `virtual:all-icons` is the whole set, for loading on demand. It is a copy of the package's own
 * index rather than an import of it: once anything uses every export of the real index, rolldown
 * keeps all icons attached to it, and every page importing a single icon gets the full set.
 */
function contentIcons(command: 'build' | 'serve') {
  const allIcons = 'virtual:all-icons';
  const sources: Record<
    string,
    { files: RegExp; read: (content: string) => string[] }
  > = {
    'virtual:frontmatter-icons': {
      files: /\.mdx$/,
      read: (content) => {
        const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
        const icon = frontmatter?.match(/^icon:\s*['"]?(\w+)/m)?.[1];
        return icon ? [icon] : [];
      },
    },
    'virtual:story-icons': {
      files: /\.(stories|dodont)\.tsx$/,
      read: (content) =>
        [
          ...content.matchAll(
            /import\s*{([^}]*)}\s*from\s*['"]@navikt\/aksel-icons['"]/g,
          ),
        ].flatMap(([, names]) =>
          // `type A, B as C` -> A, B
          names.split(',').map(
            (name) =>
              name
                .trim()
                .replace(/^type\s+/, '')
                .split(/\s/)[0],
          ),
        ),
    },
  };

  const findIcons = ({ files, read }: (typeof sources)[string]) => {
    const icons = new Set<string>();
    for (const file of readdirSync(contentDir, { recursive: true })) {
      if (typeof file !== 'string' || !files.test(file)) continue;
      for (const icon of read(readFileSync(join(contentDir, file), 'utf-8'))) {
        if (icon) icons.add(icon);
      }
    }
    return [...icons].sort();
  };

  return {
    name: 'content-icons',
    resolveId(id: string) {
      if (id === allIcons || id in sources) return `\0${id}`;
    },
    async load(
      this: { resolve: (id: string) => Promise<{ id: string } | null> },
      id: string,
    ) {
      const name = id.startsWith('\0') ? id.slice(1) : '';
      if (name !== allIcons && !sources[name]) return;
      // The dev server doesn't bundle, and this way content edits never need a restart.
      if (command === 'serve') return `export * from '@navikt/aksel-icons';`;
      if (name === allIcons) {
        const index = (await this.resolve('@navikt/aksel-icons'))?.id;
        if (!index) throw new Error('Could not resolve @navikt/aksel-icons');
        const dir = dirname(index).replaceAll('\\', '/');
        return readFileSync(index, 'utf-8').replaceAll('"./', `"${dir}/`);
      }
      return `export { ${findIcons(sources[name]).join(', ')} } from '@navikt/aksel-icons';`;
    },
  };
}

export default defineConfig(({ isSsrBuild, command }) => ({
  build: {
    dynamicImportVarsOptions: {
      exclude: [/node_modules\/(?!.*microlighter)/],
    },
    rolldownOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  // In dev, resolve @internal/components directly to its source so edits
  // hot-reload. In build mode, fall back to normal package resolution via
  // node_modules so peer-dep resolution stays correct.
  resolve:
    command === 'serve'
      ? {
          alias: { '@internal/components': internalComponentsDir },
          tsconfigPaths: true,
        }
      : { tsconfigPaths: true },
  plugins: [reactRouter(), mdxFullReload(), contentIcons(command)],
  ssr: {
    // `ramda` is not a dependency of this app, but of the CLI (`@digdir/designsystemet/internal`), which is bundled into the server build
    noExternal: ['@navikt/aksel-icons', 'ramda'],
  },
  optimizeDeps: {
    exclude: ['microlighter'],
    include: ['react', 'react-dom', 'react-router'],
  },
  server: {
    warmup: {
      clientFiles: ['./app/root.tsx', './app/entry.client.tsx'],
    },
  },
  oxc: {
    jsx: {
      runtime: 'automatic',
    },
  },
}));
