import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import i18nConf from '../../i18n';

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
                let folder = contentFolder;
                /* special case for component docs, since it has two folders */
                if (contentFolder === 'components-docs') {
                  folder = 'components';
                }
                if (contentFolder === 'components') {
                  // Skip component content files here; they are handled separately
                  continue;
                }
                // For content files, add the route (removing .mdx extension)
                const routePath =
                  `/${lang}/${folder}/${entryRelativePath.replace(/\.mdx$/, '')}`.replace(
                    /\\/g,
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

// Function to get all component paths (overview and code pages)
const getComponentPaths = (): string[] => {
  const componentsBasePath = join(dirname, './app/content/components');
  const paths: string[] = [];
  const supportedLanguages = i18nConf.supportedLngs;

  try {
    // Get all component folders
    const componentFolders = readdirSync(componentsBasePath).filter((dir) => {
      const fullPath = join(componentsBasePath, dir);
      return statSync(fullPath).isDirectory();
    });

    // For each component folder
    for (const component of componentFolders) {
      const componentPath = join(componentsBasePath, component);

      // Check each language
      for (const lang of supportedLanguages) {
        const langPath = join(componentPath, lang);

        // Skip if language folder doesn't exist
        if (!existsSync(langPath) || !statSync(langPath).isDirectory()) {
          continue;
        }

        // Check for overview.mdx and code.mdx
        const overviewPath = join(langPath, 'overview.mdx');
        const codePath = join(langPath, 'code.mdx');
        const a11yPath = join(langPath, 'accessibility.mdx');

        if (existsSync(overviewPath)) {
          paths.push(`/${lang}/components/docs/${component}/overview`);
        }

        if (existsSync(codePath)) {
          paths.push(`/${lang}/components/docs/${component}/code`);
        }

        if (existsSync(a11yPath)) {
          paths.push(`/${lang}/components/docs/${component}/accessibility`);
        }
      }
    }

    return paths;
  } catch (error) {
    console.warn(`Error determining component paths: ${error}`);
    return [];
  }
};

export function generatePrerenderPaths() {
  const contentPaths = getContentPathsWithLanguages();
  const componentPaths = getComponentPaths();
  return [
    '/no/components',
    '/en/components',
    ...contentPaths,
    ...(process.env.APP_ENV === 'production'
      ? []
      : ['/no/changelog', '/en/changelog', ...componentPaths]),
  ];
}
