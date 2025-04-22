import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Use resolve to ensure we have an absolute path even if import.meta.dirname is undefined
const dirname =
  import.meta.dirname ||
  (typeof __dirname !== 'undefined' ? __dirname : resolve('.'));

const safeReadDir = (path: string): string[] => {
  try {
    return readdirSync(path);
  } catch (error) {
    console.warn(`Could not read directory: ${path}`);
    return [];
  }
};

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
  const basePath = join(dirname, '../../app/content');
  const currentPath = join(basePath, path, currentRelativePath);

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
          results = results.concat(
            getFilesFromContentDir(path, entryRelativePath),
          );
        } else if (entry.endsWith('.mdx')) {
          results.push({
            path: entryPath,
            relativePath: entryRelativePath,
          });
        }
      } catch (error) {
        console.warn(`Could not stat entry: ${entryPath}`);
      }
    }

    return results;
  } catch (error) {
    console.warn(`Could not read content directory: ${currentPath}`);
    return [];
  }
};

export const getFileFromContentDir = (path: string) => {
  const basePath = join(dirname, '../../app/content');

  try {
    return safeReadFile(join(basePath, path));
  } catch (error) {
    console.error(`Error reading file from content directory: ${path}`);
    return '';
  }
};
