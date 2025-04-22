import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

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
  const currentPath = join(
    process.cwd(),
    getContentPath(),
    path,
    currentRelativePath,
  );
  const entries = readdirSync(currentPath);

  let results: Array<{ path: string; relativePath: string }> = [];

  for (const entry of entries) {
    const entryPath = join(currentPath, entry);
    const entryRelativePath = currentRelativePath
      ? join(currentRelativePath, entry)
      : entry;

    if (statSync(entryPath).isDirectory()) {
      // Recursively search subdirectory
      results = results.concat(getFilesFromContentDir(path, entryRelativePath));
    } else if (entry.endsWith('.mdx')) {
      // Add MDX file to results
      results.push({
        path: entryPath,
        relativePath: entryRelativePath,
      });
    }
  }

  return results;
};

export const getFileFromContentDir = (path: string) => {
  return readFileSync(join(process.cwd(), getContentPath(), path), 'utf-8');
};
