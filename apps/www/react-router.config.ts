import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Config } from '@react-router/dev/config';
// Function to get all content paths taking into account the language structure
const getContentPathsWithLanguages = (): string[] => {
  const contentBasePath = join(process.cwd(), 'app/content');
  const paths: string[] = [];
  const supportedLanguages = ['nb', 'en']; // Adjust as needed

  try {
    // First, get all top-level content folders (e.g., monstre, bloggen, etc.)
    const contentFolders = readdirSync(contentBasePath).filter((dir) =>
      statSync(join(contentBasePath, dir)).isDirectory(),
    );

    // For each content section folder
    for (const contentFolder of contentFolders) {
      const sectionPath = join(contentBasePath, contentFolder);

      // Add index routes for sections that have specific index handling
      if (
        ['monstre', 'komponenter', 'bloggen', 'grunnleggende'].includes(
          contentFolder,
        )
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
                const routePath = `/${lang}/${contentFolder}/${entryRelativePath.replace(/\.mdx$/, '')}`;
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

export default {
  presets: [
    /* vercelPreset() */
  ],
  ssr: true,
  buildDirectory: 'dist',
  async prerender() {
    return getContentPathsWithLanguages();
  },
  async serverBundles(args) {
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
  serverBuildFile: 'root/index.js',
} satisfies Config;
