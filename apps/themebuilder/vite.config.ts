import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

const internalComponentsDir = fileURLToPath(
  new URL('../../internal/components', import.meta.url),
);

export default defineConfig(({ isSsrBuild, command }) => ({
  plugins: [reactRouter()],
  ssr: {
    noExternal: ['@navikt/aksel-icons', 'ramda'],
  },
  // In dev, resolve @internal/components directly to its source so edits
  // hot-reload. In build mode, use normal node_modules resolution so
  // peer-dep resolution stays correct.
  resolve:
    command === 'serve'
      ? {
          alias: { '@internal/components': internalComponentsDir },
          tsconfigPaths: true,
        }
      : { tsconfigPaths: true },
  build: {
    rolldownOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router'],
  },
  oxc: {
    jsx: {
      runtime: 'automatic',
    },
  },
}));
