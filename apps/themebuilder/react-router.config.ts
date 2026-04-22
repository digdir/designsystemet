import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import type { Config } from '@react-router/dev/config';

// Ensure we always have a valid dirname
const dirname = cwd();

const config: Config = {
  ssr: true,
  buildDirectory: 'dist',
  presets: [],
  buildEnd: async () => {
    const robotsPath = join(dirname, 'public', 'robots.txt');
    const robotsContent =
      process.env.APP_ENV === 'production'
        ? `User-agent: *\nAllow: /`
        : `User-agent: *\nDisallow: /`;

    console.log(`Writing robots.txt to ${robotsPath}`);
    try {
      writeFileSync(robotsPath, robotsContent);
      writeFileSync(
        join(dirname, 'dist', 'client', 'robots.txt'),
        robotsContent,
      );
    } catch (error) {
      console.error(`Error writing robots.txt file: ${error}`);
      throw new Error(`Failed to write robots.txt file: ${error}`);
    }
  },
};

export default config;
