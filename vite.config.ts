import path from 'node:path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@doc-components': path.resolve(
        __dirname,
        './apps/storybook/docs-components',
      ),
      '@assets': path.resolve(__dirname, './apps/storybook/assets'),
    },
  },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  // Temporary "fix" https://github.com/storybookjs/storybook/issues/28542
  optimizeDeps: {
    exclude: [
      './apps/storybook/node_modules/.cache/storybook',
      './apps/storybook/docs-components',
    ],
  },
});
