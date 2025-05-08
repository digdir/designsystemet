import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';
import { normalizePath } from 'vite';

const config: Config = {
  ssr: true,
  buildDirectory: 'dist',
  prerender: async () => {
    const contentPaths = getContentPathsWithLanguages();
    return ['/no/components', ...contentPaths];
  },
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
  },
};

// Ensure we always have a valid dirname, even in Vercel's environment
const dirname = cwd();

// Function to get all content paths taking into account the language structure
const getContentPathsWithLanguages = (): string[] => {
  const contentBasePath = join(dirname, './app/content');
  const paths: string[] = [];
  const supportedLanguages = ['no', 'en']; // Adjust as needed

  try {
    // First, get all top-level content folders (e.g., patterns, blog, etc.)
    const contentFolders = readdirSync(contentBasePath).filter((dir) =>
      statSync(join(contentBasePath, dir)).isDirectory(),
    );

    // For each content section folder
    for (const contentFolder of contentFolders) {
      const sectionPath = join(contentBasePath, contentFolder);

      // Add index routes for sections that have specific index handling
      if (
        [
          'patterns',
          'components',
          'blog',
          'fundamentals',
          'best-practices',
        ].includes(contentFolder)
      ) {
        for (const lang of supportedLanguages) {
          paths.push(`/${lang}/${contentFolder}`);
        }
      }

      // Now find language folders inside each content section
      for (const lang of supportedLanguages) {
        const langPath = join(sectionPath, lang);

        // Skip if language folder doesn't exist
        if (!existsSync(langPath) || !statSync(langPath).isDirectory()) {
          continue;
        }

        // Process all files and subfolders within this language folder
        const processLanguageFolder = (
          folderPath: string,
          relativePath = '',
        ) => {
          try {
            const entries = readdirSync(folderPath);

            for (const entry of entries) {
              const entryPath = join(folderPath, entry);
              const entryRelativePath = relativePath
                ? join(relativePath, entry)
                : entry;

              if (statSync(entryPath).isDirectory()) {
                // Process subdirectories recursively
                processLanguageFolder(entryPath, entryRelativePath);
              } else if (entry.endsWith('.mdx')) {
                // For content files, add the route (removing .mdx extension)
                const routePath =
                  `/${lang}/${contentFolder}/${entryRelativePath.replace(/\.mdx$/, '')}`.replace(
                    '\\',
                    '/',
                  );
                paths.push(routePath);
              }
            }
          } catch (error) {
            console.warn(
              `Error processing language folder: ${folderPath}`,
              error,
            );
          }
        };

        processLanguageFolder(langPath);
      }
    }

    // Add root paths for each language
    paths.push(...supportedLanguages.map((lang) => `/${lang}`));

    return paths;
  } catch (error) {
    console.warn(`Error determining content paths: ${error}`);
    return [];
  }
};

export default config;
