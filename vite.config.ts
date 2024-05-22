import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@doc-components': path.resolve(__dirname, './docs-components'),
    },
  },
  plugins: [react()],
});
