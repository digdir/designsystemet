import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  presets: [
    /* vercelPreset() */
  ],
  buildDirectory: 'dist',
} satisfies Config;
