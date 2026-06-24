import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vitest/config';
import { envOnlyMacros } from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';

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

export default defineConfig(({ isSsrBuild, command }) => ({
  build: {
    rollupOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
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
      ? { alias: { '@internal/components': internalComponentsDir } }
      : undefined,
  plugins: [tsconfigPaths(), envOnlyMacros(), reactRouter(), mdxFullReload()],
  ssr: {
    noExternal: ['@navikt/aksel-icons', 'ramda'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router'],
    esbuildOptions: {
      jsx: 'automatic',
    },
  },
  server: {
    warmup: {
      clientFiles: ['./app/root.tsx', './app/entry.client.tsx'],
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
}));
