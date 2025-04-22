import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const dirname = import.meta.dirname || __dirname;

// Simplified manual chunks function to avoid variable initialization issues
function manualChunks(id: string) {
  if (id.toLowerCase().includes('digdir')) {
    return 'vendor-digdir';
  }

  if (id.toLowerCase().includes('nav')) {
    return 'vendor-nav';
  }

  if (id.toLowerCase().includes('repo')) {
    return 'vendor-repo';
  }

  if (id.toLowerCase().includes('components')) {
    return 'vendor-components';
  }

  if (id.toLowerCase().includes('mdx')) {
    return 'vendor-mdx';
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
  plugins: [reactRouter(), tsconfigPaths()],
});
