import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import i18nConf from '../../i18n';

const APP_ROOT = cwd();
const CONTENT_BASE_PATH = join(APP_ROOT, './app/content');
const COMPONENTS_BASE_PATH = join(CONTENT_BASE_PATH, 'components');

const SECTIONS_WITH_INDEX_ROUTES = [
  'intro',
  'patterns',
  'components',
  'blog',
  'fundamentals',
  'best-practices',
] as const;

const COMPONENT_PAGE_TYPES = ['overview', 'code', 'accessibility'] as const;

/**
 * Checks if a path exists and is a directory
 */
function isDirectory(path: string): boolean {
  return existsSync(path) && statSync(path).isDirectory();
}

/**
 * Gets all directory names in a given path
 */
function getDirectories(path: string): string[] {
  if (!isDirectory(path)) return [];

  return readdirSync(path).filter((entry) => isDirectory(join(path, entry)));
}

/**
 * Normalizes a route path to use forward slashes
 */
function normalizeRoutePath(path: string): string {
  return path.replace(/\\/g, '/');
}

/**
 * Maps content folder names to their route names
 */
function getRouteFolder(contentFolder: string): string {
  return contentFolder === 'components-docs' ? 'components' : contentFolder;
}

/**
 * Recursively processes MDX files in a language folder and generates routes
 */
function processMdxFiles(
  folderPath: string,
  lang: string,
  contentFolder: string,
  relativePath = '',
): string[] {
  const routes: string[] = [];

  try {
    const entries = readdirSync(folderPath);

    for (const entry of entries) {
      const entryPath = join(folderPath, entry);
      const entryRelativePath = relativePath
        ? join(relativePath, entry)
        : entry;

      if (statSync(entryPath).isDirectory()) {
        routes.push(
          ...processMdxFiles(entryPath, lang, contentFolder, entryRelativePath),
        );
      } else if (entry.endsWith('.mdx')) {
        const routeFolder = getRouteFolder(contentFolder);
        const routeWithoutExtension = entryRelativePath.replace(/\.mdx$/, '');
        const routePath = normalizeRoutePath(
          `/${lang}/${routeFolder}/${routeWithoutExtension}`,
        );
        routes.push(routePath);
      }
    }
  } catch (error) {
    console.warn(`Error processing folder: ${folderPath}`, error);
  }

  return routes;
}

/**
 * Generates index routes for content sections (e.g., /no/patterns, /en/blog)
 */
function getContentIndexRoutes(
  contentFolders: string[],
  languages: string[],
): string[] {
  const routes: string[] = [];
  const sectionsSet = new Set(SECTIONS_WITH_INDEX_ROUTES);

  for (const folder of contentFolders) {
    if (
      sectionsSet.has(folder as (typeof SECTIONS_WITH_INDEX_ROUTES)[number])
    ) {
      for (const lang of languages) {
        routes.push(`/${lang}/${folder}`);
      }
    }
  }

  return routes;
}

/**
 * Generates routes for all content MDX files
 */
function getContentFileRoutes(
  contentFolders: string[],
  languages: string[],
): string[] {
  const routes: string[] = [];

  for (const contentFolder of contentFolders) {
    // Skip regular components folder - handled separately
    if (contentFolder === 'components') continue;

    const sectionPath = join(CONTENT_BASE_PATH, contentFolder);

    for (const lang of languages) {
      const langPath = join(sectionPath, lang);
      if (!isDirectory(langPath)) continue;

      routes.push(...processMdxFiles(langPath, lang, contentFolder));
    }
  }

  return routes;
}

/**
 * Generates all content-related routes
 */
function getContentPaths(): string[] {
  const languages = i18nConf.supportedLngs;

  try {
    const contentFolders = getDirectories(CONTENT_BASE_PATH);
    const indexRoutes = getContentIndexRoutes(contentFolders, languages);
    const fileRoutes = getContentFileRoutes(contentFolders, languages);
    const languageRoots = languages.map((lang) => `/${lang}`);

    return [...indexRoutes, ...fileRoutes, ...languageRoots];
  } catch (error) {
    console.warn(`Error determining content paths: ${error}`);
    return [];
  }
}

/**
 * Generates routes for component documentation pages
 */
function getComponentPaths(): string[] {
  const languages = i18nConf.supportedLngs;
  const routes: string[] = [];

  try {
    const componentFolders = getDirectories(COMPONENTS_BASE_PATH);

    for (const component of componentFolders) {
      const componentPath = join(COMPONENTS_BASE_PATH, component);

      for (const lang of languages) {
        const langPath = join(componentPath, lang);
        if (!isDirectory(langPath)) continue;

        for (const pageType of COMPONENT_PAGE_TYPES) {
          const pagePath = join(langPath, `${pageType}.mdx`);
          if (existsSync(pagePath)) {
            routes.push(`/${lang}/components/docs/${component}/${pageType}`);
          }
        }
      }
    }

    return routes;
  } catch (error) {
    console.warn(`Error determining component paths: ${error}`);
    return [];
  }
}

/**
 * Generates all prerender paths for the application
 */
export function generatePrerenderPaths(): string[] {
  const contentPaths = getContentPaths();
  const componentPaths = getComponentPaths();
  const basePaths = ['/no/components', '/en/components'];

  return [
    ...basePaths,
    ...contentPaths,
    '/no/components/changelog',
    '/en/components/changelog',
    ...componentPaths,
  ];
}
