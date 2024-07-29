import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

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
});
