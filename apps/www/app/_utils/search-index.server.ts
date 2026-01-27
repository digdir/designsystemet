import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

export type SearchIndexItem = {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  type: 'component' | 'blog' | 'fundamentals' | 'best-practices' | 'patterns';
  lang: 'en' | 'no';
};

export type SearchIndex = SearchIndexItem[];

const dirname = cwd();
const basePath = join(dirname, './app/content');

/**
 * Extract frontmatter from MDX content
 */
function extractFrontmatter(content: string): Record<string, string> {
  // Normalize line endings to LF
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const frontmatterMatch = normalizedContent.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const frontmatterContent = frontmatterMatch[1];
  const frontmatter: Record<string, string> = {};

  for (const line of frontmatterContent.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove surrounding quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Strip MDX/Markdown syntax to get plain text
 */
function stripMdxSyntax(content: string): string {
  // Normalize line endings
  let text = content.replace(/\r\n/g, '\n');

  // Remove frontmatter
  text = text.replace(/^---\n[\s\S]*?\n---\n?/, '');

  // Remove JSX/MDX components
  text = text.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '');
  text = text.replace(/<[A-Z][^>]*\/>/g, '');

  // Remove HTML comments (repeat until fully removed to avoid incomplete multi-character sanitization)
  let prevText: string;
  do {
    prevText = text;
    text = text.replace(/<!--[\s\S]*?-->/g, '');
  } while (text !== prevText);

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`[^`]+`/g, '');

  // Remove markdown links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove markdown formatting
  text = text.replace(/[*_~]+([^*_~]+)[*_~]+/g, '$1');

  // Remove headings markers
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Truncate for index size
  return text.slice(0, 500);
}

/**
 * Recursively find all MDX files in a directory
 */
function findMdxFiles(
  dir: string,
  files: { path: string; relativePath: string }[] = [],
  relativeBase = '',
): { path: string; relativePath: string }[] {
  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const relativePath = relativeBase ? join(relativeBase, entry) : entry;

      try {
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
          findMdxFiles(fullPath, files, relativePath);
        } else if (entry.endsWith('.mdx')) {
          files.push({ path: fullPath, relativePath });
        }
      } catch {
        // Skip files we can't read
      }
    }
  } catch {
    // Skip directories we can't read
  }

  return files;
}

/**
 * Load metadata.json for a component if it exists
 */
function loadComponentMetadata(
  componentPath: string,
): Record<string, { title?: string; subtitle?: string }> | null {
  try {
    const metadataPath = join(componentPath, 'metadata.json');
    const content = readFileSync(metadataPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Build search index for components
 */
function indexComponents(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  const componentsPath = join(basePath, 'components');

  try {
    const componentDirs = readdirSync(componentsPath);

    for (const componentDir of componentDirs) {
      const componentPath = join(componentsPath, componentDir);

      if (!statSync(componentPath).isDirectory()) continue;

      const metadata = loadComponentMetadata(componentPath);

      for (const lang of ['en', 'no'] as const) {
        const langPath = join(componentPath, lang);

        try {
          const files = readdirSync(langPath);

          for (const file of files) {
            if (!file.endsWith('.mdx')) continue;

            const filePath = join(langPath, file);
            const content = readFileSync(filePath, 'utf-8');
            const frontmatter = extractFrontmatter(content);
            const pageType = file.replace('.mdx', '');

            const title =
              frontmatter.title ||
              metadata?.[lang]?.title ||
              componentDir.charAt(0).toUpperCase() + componentDir.slice(1);

            const description =
              frontmatter.description || metadata?.[lang]?.subtitle || '';

            items.push({
              id: `component-${componentDir}-${lang}-${pageType}`,
              title: `${title}${pageType !== 'overview' ? ` - ${pageType}` : ''}`,
              description: description.replace(/`/g, ''),
              content: stripMdxSyntax(content),
              url: `/${lang}/components/docs/${componentDir}/${pageType}`,
              type: 'component',
              lang,
            });
          }
        } catch {
          // Language folder doesn't exist
        }
      }
    }
  } catch (error) {
    console.error('Error indexing components:', error);
  }

  return items;
}

/**
 * Build search index for blog posts
 */
function indexBlog(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  const blogPath = join(basePath, 'blog');

  for (const lang of ['en', 'no'] as const) {
    const langPath = join(blogPath, lang);
    const mdxFiles = findMdxFiles(langPath);

    for (const { path, relativePath } of mdxFiles) {
      try {
        const content = readFileSync(path, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        const slug = relativePath.replace('.mdx', '');

        items.push({
          id: `blog-${lang}-${slug}`,
          title: frontmatter.title || slug,
          description: frontmatter.description || '',
          content: stripMdxSyntax(content),
          url: `/${lang}/blog/${slug}`,
          type: 'blog',
          lang,
        });
      } catch {
        // Skip files we can't read
      }
    }
  }

  return items;
}

/**
 * Build search index for fundamentals
 */
function indexFundamentals(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  const fundamentalsPath = join(basePath, 'fundamentals');

  for (const lang of ['en', 'no'] as const) {
    const langPath = join(fundamentalsPath, lang);
    const mdxFiles = findMdxFiles(langPath);

    for (const { path, relativePath } of mdxFiles) {
      try {
        const content = readFileSync(path, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        // Convert file path to URL path
        const slug = relativePath.replace('.mdx', '').replace(/\\/g, '/');

        items.push({
          id: `fundamentals-${lang}-${slug}`,
          title: frontmatter.title || slug.split('/').pop() || slug,
          description: frontmatter.description || '',
          content: stripMdxSyntax(content),
          url: `/${lang}/fundamentals/${slug}`,
          type: 'fundamentals',
          lang,
        });
      } catch {
        // Skip files we can't read
      }
    }
  }

  return items;
}

/**
 * Build search index for best practices
 */
function indexBestPractices(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  const bestPracticesPath = join(basePath, 'best-practices');

  for (const lang of ['en', 'no'] as const) {
    const langPath = join(bestPracticesPath, lang);
    const mdxFiles = findMdxFiles(langPath);

    for (const { path, relativePath } of mdxFiles) {
      try {
        const content = readFileSync(path, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        const slug = relativePath.replace('.mdx', '').replace(/\\/g, '/');

        items.push({
          id: `best-practices-${lang}-${slug}`,
          title: frontmatter.title || slug.split('/').pop() || slug,
          description: frontmatter.description || '',
          content: stripMdxSyntax(content),
          url: `/${lang}/best-practices/${slug}`,
          type: 'best-practices',
          lang,
        });
      } catch {
        // Skip files we can't read
      }
    }
  }

  return items;
}

/**
 * Build search index for patterns
 */
function indexPatterns(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  const patternsPath = join(basePath, 'patterns');

  for (const lang of ['en', 'no'] as const) {
    const langPath = join(patternsPath, lang);
    const mdxFiles = findMdxFiles(langPath);

    for (const { path, relativePath } of mdxFiles) {
      try {
        const content = readFileSync(path, 'utf-8');
        const frontmatter = extractFrontmatter(content);

        const slug = relativePath.replace('.mdx', '').replace(/\\/g, '/');

        items.push({
          id: `patterns-${lang}-${slug}`,
          title: frontmatter.title || slug.split('/').pop() || slug,
          description: frontmatter.description || '',
          content: stripMdxSyntax(content),
          url: `/${lang}/patterns/${slug}`,
          type: 'patterns',
          lang,
        });
      } catch {
        // Skip files we can't read
      }
    }
  }

  return items;
}

/**
 * Build the complete search index
 */
export function buildSearchIndex(): SearchIndex {
  return [
    ...indexComponents(),
    ...indexBlog(),
    ...indexFundamentals(),
    ...indexBestPractices(),
    ...indexPatterns(),
  ];
}

/**
 * Simple search function that scores results by relevance
 */
export function searchIndex(
  index: SearchIndex,
  query: string,
  lang: 'en' | 'no',
  limit = 20,
): SearchIndexItem[] {
  if (!query.trim()) return [];

  const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  // Type priority multipliers (blog is deprioritized)
  const typePriority: Record<string, number> = {
    component: 1.0,
    fundamentals: 1.0,
    patterns: 1.0,
    'best-practices': 1.0,
    blog: 0.3,
  };

  const scored = index
    .filter((item) => item.lang === lang)
    .map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const contentLower = item.content.toLowerCase();

      for (const term of searchTerms) {
        // Title matches (heavily prioritized)
        if (titleLower === term) {
          // Exact title match
          score += 1000;
        } else if (titleLower.startsWith(term)) {
          // Title starts with term
          score += 500;
        } else if (titleLower.includes(term)) {
          // Title contains term as a word
          const wordBoundaryMatch = new RegExp(`\\b${term}\\b`).test(
            titleLower,
          );
          score += wordBoundaryMatch ? 200 : 100;
        }

        // Description matches
        if (descLower.includes(term)) {
          const wordBoundaryMatch = new RegExp(`\\b${term}\\b`).test(descLower);
          score += wordBoundaryMatch ? 20 : 10;
        }

        // Content matches (lowest priority)
        if (contentLower.includes(term)) score += 5;
      }

      // Apply type priority multiplier
      score *= typePriority[item.type] ?? 1.0;

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);

  return scored;
}

// Cache for the search index
let cachedIndex: SearchIndex | null = null;

/**
 * Get or build the search index (with caching)
 */
export function getSearchIndex(): SearchIndex {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex();
  }
  return cachedIndex;
}

/**
 * Clear the search index cache
 */
export function clearSearchIndexCache(): void {
  cachedIndex = null;
}
