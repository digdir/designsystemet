import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  css: {
    postcss: {
      plugins: [],
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, './app/content/**/*')),
          dest: './app/content',
        },
      ],
    }),
  ],
});
