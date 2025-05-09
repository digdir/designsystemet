import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: { 'process.env': {} },
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  // Temporary "fix" https://github.com/storybookjs/storybook/issues/28542
  optimizeDeps: {
    exclude: ['./node_modules/.cache/storybook'],
  },
});
