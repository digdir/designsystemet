import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import type { Config } from '@react-router/dev/config';
import i18nConf from './app/i18n';

// Ensure we always have a valid dirname
const dirname = cwd();

// Function to get all content paths taking into account the language structure
const getContentPathsWithLanguages = (): string[] => {
  const contentBasePath = join(dirname, './app/content');
  const paths: string[] = [];
  const supportedLanguages = i18nConf.supportedLngs;

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

const contentPaths = getContentPathsWithLanguages();
const allPages = ['/no/components', '/en/components', ...contentPaths];

const config: Config = {
  ssr: true,
  buildDirectory: 'dist',
  prerender: allPages,
  presets: [],
  buildEnd: async () => {
    const robotsPath = join(dirname, 'public', 'robots.txt');
    const robotsContent =
      process.env.ENV === 'production'
        ? `User-agent: *\nAllow: /`
        : `User-agent: *\nDisallow: /`;

    console.log(`Writing robots.txt to ${robotsPath}`);
    try {
      writeFileSync(robotsPath, robotsContent);
    } catch (error) {
      console.error(`Error writing robots.txt file: ${error}`);
      throw new Error(`Failed to write robots.txt file: ${error}`);
    }
    await generateSitemap();
  },
};

// Function to generate sitemap.xml
const generateSitemap = async (): Promise<void> => {
  try {
    const baseUrl = 'https://designsystemet.no';

    // Get file modification dates for accurate lastmod
    const getLastModForPath = (urlPath: string): string => {
      try {
        // Convert URL path back to file path
        const pathParts = urlPath.split('/').filter(Boolean);
        if (pathParts.length < 2) return new Date().toISOString().split('T')[0];

        const [lang, ...segments] = pathParts;
        const contentFolder = segments[0];
        const filePath = segments.slice(1).join('/');

        // Special case for /no/components
        if (urlPath === '/no/components') {
          const path = 'app/content/components.ts';
          if (existsSync(path)) {
            const stats = statSync(path);
            return stats.mtime.toISOString().split('T')[0];
          }

          return new Date().toISOString().split('T')[0];
        }

        // For other content paths, construct the actual file path
        if (filePath) {
          const actualFilePath = join(
            dirname,
            'app/content',
            contentFolder,
            lang,
            `${filePath}.mdx`,
          );
          if (existsSync(actualFilePath)) {
            const stats = statSync(actualFilePath);
            return stats.mtime.toISOString().split('T')[0];
          }
        } else {
          // This is a section index page, try to find the index file
          const indexPath = join(
            dirname,
            'app/content',
            contentFolder,
            lang,
            'index.mdx',
          );
          if (existsSync(indexPath)) {
            const stats = statSync(indexPath);
            return stats.mtime.toISOString().split('T')[0];
          }
        }

        // Fallback to current date if file not found
        return new Date().toISOString().split('T')[0];
      } catch (error) {
        console.warn(`Could not get lastmod for ${urlPath}:`, error);
        return new Date().toISOString().split('T')[0];
      }
    };

    // Generate sitemap XML with accurate lastmod dates
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${getLastModForPath(path)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

    const sitemapPath = join(dirname, 'public', 'sitemap.xml');
    const sitemapClientPath = join(dirname, 'dist', 'client', 'sitemap.xml');
    console.log(
      `Writing sitemap.xml to ${sitemapPath} with ${allPages.length} URLs`,
    );
    writeFileSync(sitemapClientPath, sitemapXml);
  } catch (error) {
    console.error(`Error generating sitemap: ${error}`);
  }
};

export default config;
