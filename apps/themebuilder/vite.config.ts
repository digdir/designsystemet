import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: ['@navikt/aksel-icons', 'ramda'],
  },
  build: {
    rollupOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
  },
}));
