import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { defineAppConfig } from '../../vite.config.base.ts';

export default defineConfig(({ isSsrBuild, command }) =>
  defineAppConfig({
    root: import.meta.dirname,
    command,
    isSsrBuild,
    plugins: [reactRouter()],
  }),
);
