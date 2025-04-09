import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tsconfigPaths from 'vite-tsconfig-paths';

const dirname = import.meta.dirname || __dirname;

// Simplified manual chunks function to avoid variable initialization issues
function manualChunks(id: string) {
  // Core dependencies should stay in the main chunk to avoid initialization order problems
  if (id.includes('/react/')) {
    return 'vendor-react';
  }

  if (id.includes('/react-dom/')) {
    return 'vendor-react-dom';
  }

  if (id.includes('/react-router/')) {
    return 'vendor-router';
  }

  if (id.includes('digdir')) {
    return 'vendor-digdir';
  }

  if (id.includes('aksel')) {
    return 'vendor-aksel';
  }

  if (id.includes('node_modules')) {
    return 'vendor';
  }

  return null; // Let Vite decide for application code
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
        // Less aggressive hashing to preserve dependency order
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
    chunkSizeWarningLimit: 300,
    // Focus on stability over optimization
    minify: true,
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(dirname, './app/content/*')),
          dest: normalizePath(path.resolve(dirname, './dist/app/content')),
        },
      ],
    }),
  ],
});
