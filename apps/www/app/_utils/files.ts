import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

// Content cache to avoid reading from disk in dev mode
const contentCache: Record<string, string> = {};
const filesListCache: Record<
  string,
  Array<{ path: string; relativePath: string }>
> = {};

const getContentPath = () => {
  let prefixParts: string[] = [];

  if (process.env.CONTENT_PREFIX) {
    const rawValue = process.env.CONTENT_PREFIX.trim();
    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      prefixParts = rawValue
        .substring(1, rawValue.length - 1)
        .split(',')
        .map((part) => part.trim().replace(/['"]/g, ''));
    } else {
      prefixParts = rawValue
        .split(',')
        .map((part) => part.trim().replace(/['"]/g, ''));
    }
  }

  return join(...prefixParts);
};

export const getFilesFromContentDir = (
  path: string,
  currentRelativePath = '',
) => {
  // Create a cache key from the path and currentRelativePath
  const cacheKey = `${path}:${currentRelativePath}`;

  // Return cached result if available
  if (filesListCache[cacheKey]) {
    return filesListCache[cacheKey];
  }

  const currentPath = join(
    process.cwd(),
    getContentPath(),
    path,
    currentRelativePath,
  );

  try {
    const entries = readdirSync(currentPath);
    let results: Array<{ path: string; relativePath: string }> = [];

    for (const entry of entries) {
      const entryPath = join(currentPath, entry);
      const entryRelativePath = currentRelativePath
        ? join(currentRelativePath, entry)
        : entry;

      if (statSync(entryPath).isDirectory()) {
        // Recursively search subdirectory
        results = results.concat(
          getFilesFromContentDir(path, entryRelativePath),
        );
      } else if (entry.endsWith('.mdx')) {
        // Add MDX file to results
        results.push({
          path: entryPath,
          relativePath: entryRelativePath,
        });
      }
    }

    // Cache the results
    filesListCache[cacheKey] = results;
    return results;
  } catch (error) {
    console.warn(`Could not read content directory: ${currentPath}`, error);
    return [];
  }
};

export const getFileFromContentDir = (path: string) => {
  // Check if the content is already cached
  if (contentCache[path]) {
    return contentCache[path];
  }

  try {
    // Read the file from disk
    const content = readFileSync(
      join(process.cwd(), getContentPath(), path),
      'utf-8',
    );

    // Cache the content
    contentCache[path] = content;

    return content;
  } catch (error) {
    console.error(`Error reading file from content directory: ${path}`, error);
    return '';
  }
};

// Function to preload all content files
export const preloadContentFiles = () => {
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    return; // Only preload in development mode
  }

  try {
    // Preload files from common content directories
    const contentDirectories = [
      'monstre',
      'bloggen',
      'grunnleggende',
      'components',
    ];

    for (const dir of contentDirectories) {
      const files = getFilesFromContentDir(dir);

      // Preload each file content into the cache
      for (const file of files) {
        const relativePath = join(dir, file.relativePath);
        if (!contentCache[relativePath]) {
          contentCache[relativePath] = readFileSync(file.path, 'utf-8');
        }
      }
    }

    console.log('Content files preloaded successfully');
  } catch (error) {
    console.warn('Error preloading content files:', error);
  }
};

// Preload content files when this module is imported in development
if (process.env.NODE_ENV === 'development') {
  // Use setTimeout to avoid blocking the initial load
  setTimeout(preloadContentFiles, 1000);
}
