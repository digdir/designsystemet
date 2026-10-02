import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) } },
  test: {
    name: 'themebuilder',
    include: ['app/**/*.test.ts'],
    environment: 'node',
  },
});
