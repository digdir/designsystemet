import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
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

  // Check if directory exists before trying to read it
  if (!existsSync(currentPath)) {
    console.warn(`Directory does not exist: ${currentPath}`);
    return [];
  }

  let entries: string[];
  try {
    entries = readdirSync(currentPath);
  } catch (error) {
    console.error(`Error reading directory ${currentPath}:`, error);
    return [];
  }

  let results: Array<{ path: string; relativePath: string }> = [];

  for (const entry of entries) {
    const entryPath = join(currentPath, entry);
    const entryRelativePath = currentRelativePath
      ? join(currentRelativePath, entry)
      : entry;

    try {
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
    } catch (error) {
      console.error(`Error processing entry ${entryPath}:`, error);
    }
  }

  return results;
};

export const getFileFromContentDir = (path: string) => {
  const filePath = join(process.cwd(), getContentPath(), path);

  // Check if file exists before trying to read it
  if (!existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    throw new Error(`File not found: ${path}`);
  }

  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
};
