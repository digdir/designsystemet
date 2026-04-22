import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

const dirname = cwd();

export const safeReadDir = (path: string): string[] => {
  try {
    return readdirSync(path);
  } catch (_error) {
    console.warn(`Could not read directory: ${path}`);
    return [];
  }
};

const safeReadFile = (path: string): string => {
  try {
    return readFileSync(path, 'utf-8');
  } catch (_error) {
    console.error(`Error reading file: ${path}`);
    return '';
  }
};

export const getFilesFromContentDir = (
  path: string,
  currentRelativePath = '',
) => {
  const basePath = join(dirname, './app/content');
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
      } catch (_error) {
        console.warn(`Could not stat entry: ${entryPath}`);
      }
    }

    return results;
  } catch (_error) {
    console.warn(`Could not read content directory: ${currentPath}`);
    return [];
  }
};

export const getFileFromContentDir = (path: string) => {
  const basePath = join(dirname, './app/content');

  try {
    return safeReadFile(join(basePath, path));
  } catch (_error) {
    console.error(`Error reading file from content directory: ${path}`);
    return '';
  }
};

export const getFoldersInContentDir = (path: string) => {
  const basePath = join(dirname, './app/content');

  try {
    const entries = safeReadDir(join(basePath, path));
    return entries.filter((entry) => {
      const entryPath = join(basePath, path, entry);
      return statSync(entryPath).isDirectory();
    });
  } catch (_error) {
    console.error(`Error reading folders from content directory: ${path}`);
    return [];
  }
};
