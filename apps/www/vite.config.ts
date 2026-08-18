import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, mergeConfig } from 'vite';
import { defineAppConfig } from '../../vite.config.base.ts';

/**
 * MDX files are compiled at request time by mdx-bundler rather than going through
 * Vite's module graph, so Vite has no way to know what to invalidate. Reload the
 * whole page instead.
 */
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

export default defineConfig(({ isSsrBuild, command }) =>
  mergeConfig(
    defineAppConfig({
      root: import.meta.dirname,
      command,
      isSsrBuild,
      plugins: [reactRouter(), mdxFullReload()],
    }),
    {
      // Opt out of any PostCSS config found by directory traversal; www ships
      // plain CSS.
      css: {
        postcss: {
          plugins: [],
        },
      },
      server: {
        warmup: {
          clientFiles: ['./app/root.tsx', './app/entry.client.tsx'],
        },
      },
    },
  ),
);
