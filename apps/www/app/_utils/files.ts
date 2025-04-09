import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

// This function is only used during build time
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

// Legacy functions - keep them but mark as deprecated
/**
 * @deprecated Use the content maps instead of dynamic file reading
 */
export const getFilesFromContentDir = (path: string) => {
  return readdirSync(join(process.cwd(), getContentPath(), path));
};

/**
 * @deprecated Use the content maps instead of dynamic file reading
 */
export const getFileFromContentDir = (path: string) => {
  return readFileSync(join(process.cwd(), getContentPath(), path), 'utf-8');
};

// New build-time content map approach
// This is populated via a build script that runs before deployment
// This is just a type definition - the actual map is generated at build time
interface ContentMap {
  [path: string]: {
    content: string;
  };
}

interface DirectoryMap {
  [path: string]: string[];
}

// These will be populated by a build script
export const contentMap: ContentMap = {};
export const directoryMap: DirectoryMap = {};

// New replacement functions that use the static maps
export const getFileContent = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

  if (!contentMap[normalizedPath]) {
    throw new Error(`Content not found for path: ${normalizedPath}`);
  }

  return contentMap[normalizedPath].content;
};

export const getDirectoryFiles = (path: string): string[] => {
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

  if (!directoryMap[normalizedPath]) {
    throw new Error(`Directory listing not found for path: ${normalizedPath}`);
  }

  return directoryMap[normalizedPath];
};
