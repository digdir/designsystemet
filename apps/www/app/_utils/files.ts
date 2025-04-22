import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

// Content cache to avoid redundant file reads
const contentCache: Record<string, string> = {};
const filesListCache: Record<
  string,
  Array<{ path: string; relativePath: string }>
> = {};

const getContentPath = () => {
  // Use a fixed content path instead of environment variables
  return join(cwd(), '/app/content/');
};

// Safe version of readdirSync that handles errors gracefully
const safeReadDir = (path: string): string[] => {
  try {
    return readdirSync(path);
  } catch (error) {
    console.warn(`Could not read directory: ${path}`);
    return [];
  }
};

// Safe version of readFileSync that handles errors gracefully
const safeReadFile = (path: string): string => {
  try {
    return readFileSync(path, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${path}`);
    return '';
  }
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

  // We need a base path that doesn't rely on process.cwd()
  // This can be adjusted based on your project structure
  const basePath = ''; // Adjust this if needed
  const currentPath = join(
    basePath,
    getContentPath(),
    path,
    currentRelativePath,
  );

  try {
    const entries = safeReadDir(currentPath);
    let results: Array<{ path: string; relativePath: string }> = [];

    for (const entry of entries) {
      const entryPath = join(currentPath, entry);
      const entryRelativePath = currentRelativePath
        ? join(currentRelativePath, entry)
        : entry;

      try {
        const stats = statSync(entryPath);
        if (stats.isDirectory()) {
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
      } catch (error) {
        // Skip this entry if we can't get stats
        console.warn(`Could not stat entry: ${entryPath}`);
      }
    }

    // Cache the results
    filesListCache[cacheKey] = results;
    return results;
  } catch (error) {
    console.warn(`Could not read content directory: ${currentPath}`);
    return [];
  }
};

export const getFileFromContentDir = (path: string) => {
  // Check if the content is already cached
  if (contentCache[path]) {
    return contentCache[path];
  }

  // We need a base path that doesn't rely on process.cwd()
  const basePath = ''; // Adjust this if needed

  try {
    // Read the file from disk
    const content = safeReadFile(join(basePath, getContentPath(), path));

    // Cache the content
    contentCache[path] = content;

    return content;
  } catch (error) {
    console.error(`Error reading file from content directory: ${path}`);
    return '';
  }
};

// Export a function to preload content that can be explicitly called when needed
export const preloadContentFiles = () => {
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
          contentCache[relativePath] = safeReadFile(file.path);
        }
      }
    }
  } catch (error) {
    console.warn('Error preloading content files');
  }
};
