import { reactRouter } from '@react-router/dev/vite';
import { vercelPreset } from '@vercel/react-router/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const dirname = import.meta.dirname || __dirname;

// Simplified manual chunks function
function manualChunks(id: string) {
  // Core dependencies should stay in the main chunk
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

  // Split remaining node_modules into smaller chunks
  if (id.includes('node_modules')) {
    // Extract package name from the path
    const match = id.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
    if (match) {
      const packageName = match[1];
      // Group smaller packages together
      return `vendor-${packageName.replace('@', '')}`;
    }
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
    vercelPreset(),
    tsconfigPaths(),
    // Remove viteStaticCopy plugin to avoid bundling content files
  ],
});
