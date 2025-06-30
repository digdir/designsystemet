import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';
import { normalizePath } from 'vite';

// Ensure we always have a valid dirname, even in Vercel's environment
const dirname = cwd();

const config: Config = {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  buildDirectory: 'dist',
  presets: [vercelPreset()],
  buildEnd: async ({ buildManifest: rrBuild }) => {
    const manifestPath = join(
      dirname,
      '.vercel/react-router-build-result.json',
    );

    /* read file contents */
    const newBuildResult: {
      // biome-ignore lint/suspicious/noExplicitAny: Won't bother with type since vercel might change it
      buildManifest?: { serverBundles?: any; routes?: any };
      viteConfig?: { ssr?: { noExternal?: string[] } };
      reactRouterConfig?: typeof rrBuild & {
        appDirectory?: string;
        buildDirectory?: string;
      };
    } = {};
    try {
      const fileContents = readFileSync(manifestPath, 'utf-8');
      newBuildResult.buildManifest = JSON.parse(fileContents).buildManifest;
      newBuildResult.viteConfig = JSON.parse(fileContents).viteConfig;
    } catch (error) {
      console.error(`Error reading manifest file: ${error}`);
      return;
    }

    /* For every item in buildmanifest.serverBundles, add config.runtime = "nodejs" */
    if (newBuildResult.buildManifest?.serverBundles) {
      // Use Object.values to get an array of the serverBundles objects
      for (const bundle of Object.values(
        newBuildResult.buildManifest.serverBundles,
      )) {
        const typedBundle = bundle as { config?: { runtime?: string } };
        typedBundle.config = typedBundle.config || {};
        typedBundle.config.runtime = 'nodejs';
      }
    }

    /* For every item in buildmanifest.routes, add config.runtime = "nodejs" */
    if (newBuildResult.buildManifest?.routes) {
      // Use Object.values to get an array of the routes objects
      for (const route of Object.values(newBuildResult.buildManifest.routes)) {
        const typedRoute = route as { config?: { runtime?: string } };
        typedRoute.config = typedRoute.config || {};
        (route as { config: { runtime: string } }).config.runtime = 'nodejs';
      }
    }

    if (!rrBuild) {
      console.error(
        'No react-router build result found. Skipping Vercel config update.',
      );
      return;
    }

    newBuildResult.reactRouterConfig = rrBuild || {};
    newBuildResult.reactRouterConfig.appDirectory = normalizePath(
      join(dirname, 'app'),
    );
    newBuildResult.reactRouterConfig.buildDirectory = normalizePath(
      join(dirname, 'dist'),
    );

    // write back to the file
    try {
      writeFileSync(manifestPath, JSON.stringify(newBuildResult, null, 2));
    } catch (error) {
      console.error(`Error writing manifest file: ${error}`);
    }

    if (process.env.NEXT_PUBLIC_DESIGNSYSTEMET_ENV === 'production') {
      const robotsPath = join(dirname, 'public', 'robots.txt');
      const robotsContent = `User-agent: *\nAllow: /`;

      try {
        writeFileSync(robotsPath, robotsContent);
      } catch (error) {
        console.error(`Error writing robots.txt file: ${error}`);
      }
    } else {
      const robotsPath = join(dirname, 'public', 'robots.txt');
      const robotsContent = `User-agent: *\nDisallow: /`;

      try {
        writeFileSync(robotsPath, robotsContent);
      } catch (error) {
        console.error(`Error writing robots.txt file: ${error}`);
      }
    }
  },
};

export default config;
