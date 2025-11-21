import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { envOnlyMacros } from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';

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

export default defineConfig({
  css: {
    postcss: {
      plugins: [],
    },
  },
  plugins: [tsconfigPaths(), envOnlyMacros(), reactRouter(), mdxFullReload()],
  ssr: {
    noExternal: ['@navikt/aksel-icons', 'ramda'],
  },
});
