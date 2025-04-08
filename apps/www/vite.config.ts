import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

function manualChunks(id: string) {
  if (id.includes('node_modules')) {
    return 'vendor';
  }

  return null;
}

export default defineConfig({
  css: {
    postcss: {
      plugins: [],
    },
  },
  build: {
    rollupOptions: {
      treeshake: true,
      output: {
        manualChunks,
      },
    },
    chunkSizeWarningLimit: 300,
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, './app/content/**/*')),
          dest: normalizePath(path.resolve(__dirname, './dist/app/content')),
        },
      ],
    }),
  ],
});
