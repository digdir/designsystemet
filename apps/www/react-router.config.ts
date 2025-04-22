import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
  ssr: true,
  buildDirectory: 'dist',
  serverBundles(args) {
    for (const route of args.branch) {
      if (route.id.includes('monstre')) {
        route.file = `routes/monstre/${route.id}.tsx`;
        return `monstre`;
      }
      if (route.id.includes('grunnleggende')) {
        route.file = `routes/grunnleggende/${route.id}.tsx`;
        return `grunnleggende`;
      }
      if (route.id.includes('bloggen')) {
        route.file = `routes/bloggen/${route.id}.tsx`;
        return `bloggen`;
      }
    }
    return 'root';
  },
  presets: [vercelPreset()],
} satisfies Config;
