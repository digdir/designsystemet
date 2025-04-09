import { contentMap, directoryMap } from './contentMap.generated';

export interface ContentItem {
  path: string;
  content: string;
}

/**
 * Gets the content of a file from the pre-built content map
 * This is a build-time optimized replacement for reading from the filesystem
 */
export function getContent(path: string): ContentItem {
  // Normalize path (remove leading slash if present)
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

  if (!contentMap[normalizedPath]) {
    throw new Error(`Content not found for path: ${normalizedPath}`);
  }

  return {
    path: normalizedPath,
    content: contentMap[normalizedPath].content,
  };
}

/**
 * Gets a list of files/directories in a directory from the pre-built directory map
 * This is a build-time optimized replacement for reading from the filesystem
 */
export function getDirectoryContents(dirPath = ''): string[] {
  // Normalize path (remove leading slash if present and trailing slash)
  const normalizedPath = dirPath.startsWith('/')
    ? dirPath.substring(1)
    : dirPath;

  // Remove trailing slash if present
  const finalPath = normalizedPath.endsWith('/')
    ? normalizedPath.slice(0, -1)
    : normalizedPath;

  if (!directoryMap[finalPath] && finalPath !== '') {
    throw new Error(`Directory listing not found for path: ${finalPath}`);
  }

  return directoryMap[finalPath] || [];
}

/**
 * Recursively gets all content items in a directory and its subdirectories
 */
export function getAllContentInDirectory(dirPath = ''): ContentItem[] {
  const normalizedPath = dirPath.startsWith('/')
    ? dirPath.substring(1)
    : dirPath;
  const prefix = normalizedPath ? `${normalizedPath}/` : '';

  return Object.entries(contentMap)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, { content }]) => ({
      path,
      content,
    }));
}

/**
 * Check if a path exists in the content map
 */
export function contentExists(path: string): boolean {
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  return !!contentMap[normalizedPath];
}
