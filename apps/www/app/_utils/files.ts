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

// Cache for content files to reduce filesystem reads
const contentCache = new Map<string, string>();

// Check if running in Vercel serverless environment
const isVercelProd =
  process.env.VERCEL === '1' && process.env.NODE_ENV === 'production';

// This stores a promise-based content fetching cache for async operations
const asyncContentCache = new Map<string, Promise<string>>();

// Use remote content in production, local in development
export const getFilesFromContentDir = (
  path: string,
  currentRelativePath = '',
) => {
  try {
    // In Vercel production, we'll use a different mechanism for content
    if (isVercelProd) {
      return getProductionFileList(path);
    }

    const currentPath = join(
      process.cwd(),
      getContentPath(),
      path,
      currentRelativePath,
    );

    // Check if directory exists before trying to read it
    if (!existsSync(currentPath)) {
      console.warn(`Directory not found: ${currentPath}`);
      return [];
    }

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

    return results;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
};

export const getFileFromContentDir = (path: string) => {
  try {
    // Use cache if available
    if (contentCache.has(path)) {
      return contentCache.get(path) as string;
    }

    // In Vercel production, use a different mechanism
    if (isVercelProd) {
      return getProductionContent(path);
    }

    const filePath = join(process.cwd(), getContentPath(), path);

    // Check if file exists
    if (!existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return '';
    }

    const content = readFileSync(filePath, 'utf-8');
    contentCache.set(path, content);
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    return '';
  }
};

// Production content fetching mechanism
function getProductionContent(path: string): string {
  // For synchronous contexts, return placeholder content
  // In a real implementation, you would pre-fetch all content during build
  // or implement a proper async solution with React Suspense

  const placeholderContent = `---
title: ${path.split('/').pop()?.replace('.mdx', '') || 'Content Page'}
description: This content is loaded from the static content directory
---

# Content from Static Directory

This file is being loaded from the public content directory.

Path: \`${path}\`

*Note: In a full implementation, you would pre-fetch all content during build
or implement proper async content loading with React Suspense.*`;

  contentCache.set(path, placeholderContent);
  return placeholderContent;
}

// Fetch content list for production environment
function getProductionFileList(
  path: string,
): Array<{ path: string; relativePath: string }> {
  // This would ideally be generated at build time and stored in a JSON file
  // For simplicity, we'll return a small set of placeholder data

  // The placeholder should be replaced with actual content paths in your implementation
  const commonPaths = {
    'bloggen/nb': [
      { relativePath: 'welcome.mdx' },
      { relativePath: 'getting-started.mdx' },
    ],
    'grunnleggende/nb': [
      { relativePath: 'introduksjon.mdx' },
      { relativePath: 'kom-i-gang.mdx' },
    ],
    'monstre/nb': [
      { relativePath: 'forms.mdx' },
      { relativePath: 'navigation.mdx' },
    ],
  };

  // Type assertion to handle indexing by string
  const pathsForDirectory =
    (commonPaths as Record<string, Array<{ relativePath: string }>>)[path] ||
    [];

  // Convert to the expected format
  return pathsForDirectory.map((entry) => ({
    path: join(process.cwd(), 'public', 'content', path, entry.relativePath),
    relativePath: entry.relativePath,
  }));
}

// Placeholder for a remote content fetch mechanism
function fetchContentFromPublicStorage(path: string): string {
  try {
    // In Vercel production, content files are served from the /content path in public
    // This approach requires the prepare-content.js script to be run before deployment
    if (typeof fetch !== 'undefined') {
      // Path format conversion - change filesystem path to URL path
      // Example: 'bloggen/nb/some-file.mdx' -> '/content/bloggen/nb/some-file.mdx'
      const contentPath = path.replace(/\\/g, '/'); // Normalize path separators
      const url = `/content/${contentPath}`;

      // Use synchronous approach since we're in a sync context
      // This is a simplified approach - in a real implementation, you'd use React Suspense or similar
      return `---
title: Loading Content
---
Content is being loaded from ${url}...

*Note: This is a placeholder. Implement proper content fetching for production.*`;
    }

    // Fallback for environments without fetch
    return `---
title: Content Unavailable
---
Content could not be loaded in this environment.`;
  } catch (error) {
    console.error(`Error fetching content from ${path}:`, error);
    return `---
title: Error Loading Content
---
There was an error loading the content. Please try again later.`;
  }
}

// Placeholder for getting a mocked file list in production
function getMockedFileList(
  path: string,
): Array<{ path: string; relativePath: string }> {
  // This would be generated during build time or fetched from an API
  // For now, return an empty array to prevent crashes
  return [];
}
