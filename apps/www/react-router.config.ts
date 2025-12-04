import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Config } from '@react-router/dev/config';
import { generatePrerenderPaths } from './app/_utils/config/generate-prerender-paths';
import { generateSitemap } from './app/_utils/config/generate-sitemap';

const config: Config = {
  ssr: true,
  buildDirectory: 'dist',
  prerender: generatePrerenderPaths(),
  presets: [],
  buildEnd: async () => {
    const dirname = process.cwd();
    const allPages = generatePrerenderPaths();
    const robotsPath = join(dirname, 'public', 'robots.txt');
    const robotsContent =
      process.env.APP_ENV === 'production'
        ? `User-agent: *\nAllow: /`
        : `User-agent: *\nDisallow: /`;

    console.log(`Writing robots.txt to ${robotsPath}`);
    try {
      writeFileSync(robotsPath, robotsContent);
    } catch (error) {
      console.error(`Error writing robots.txt file: ${error}`);
      throw new Error(`Failed to write robots.txt file: ${error}`);
    }
    await generateSitemap(allPages);
  },
};

export default config;
