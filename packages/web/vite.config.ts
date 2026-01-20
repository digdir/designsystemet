import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';

const postcssConfig = (await import('../css/postcss.config.js')).default;

export default {
  root: __dirname,
  plugins: [react()],
  css: {
    postcss: postcssConfig,
  },
  resolve: {
    alias: {
      '@digdir/designsystemet-css': resolve(__dirname, '../css/src/index.css'),
      '@digdir/designsystemet-theme': resolve(
        __dirname,
        '../css/dist/theme/designsystemet.css',
      ),
    },
  },
};
