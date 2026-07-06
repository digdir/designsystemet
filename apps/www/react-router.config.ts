import { setDefaultResultOrder } from 'node:dns';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Config } from '@react-router/dev/config';
import { generateFeeds } from './app/_utils/config/generate-feeds';
import { generatePrerenderPaths } from './app/_utils/config/generate-prerender-paths';
import { generateSitemap } from './app/_utils/config/generate-sitemap';
import i18n from './app/i18n';

// RR v8 prerenders by fetching pages from an in-process Vite preview server over
// HTTP. In some Linux/container environments `localhost` resolves to IPv6 (::1)
// for one side and IPv4 (127.0.0.1) for the other, so the prerender can't reach
// the preview server (`ECONNREFUSED 127.0.0.1`). Force IPv4 so both sides agree.
setDefaultResultOrder('ipv4first');

const config: Config = {
  ssr: true,
  buildDirectory: 'dist',
  prerender: {
    paths: generatePrerenderPaths(),
    // RR v8 prerenders by fetching each path from a preview server with a
    // hardcoded 10s timeout and no retries (neither is configurable). With
    // concurrency > 1, a heavy page (e.g. the ~140 KB intro/cba.mdx) starves its
    // concurrent neighbours of CPU while it compiles/renders, pushing them past
    // the 10s wall. Serial prerendering gives every page the full timeout to
    // itself. Raise this only if the heaviest content pages are slimmed down.
    concurrency: 1,
  },
  presets: [],
  buildEnd: async () => {
    const dirname = process.cwd();
    const allPages = generatePrerenderPaths();
    const robotsPath = join(dirname, 'public', 'robots.txt');
    const robotsContent =
      process.env.APP_ENV === 'production'
        ? `User-agent: *\nContent-Signal: ai-train=no, search=yes, ai-input=no\nAllow: /\nSitemap: https://designsystemet.no/sitemap.xml`
        : `User-agent: *\nContent-Signal: ai-train=no, search=yes, ai-input=no\nDisallow: /\nSitemap: https://designsystemet.no/sitemap.xml`;

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
    await generateSitemap(allPages);
    await Promise.all(i18n.supportedLngs.map((lang) => generateFeeds(lang)));
  },
};

export default config;
