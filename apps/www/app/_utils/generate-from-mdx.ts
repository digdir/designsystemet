import { createHash } from 'node:crypto';
import type { Root } from 'hast';
import { bundleMDX } from 'mdx-bundler';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { TableOfContentsItem, VFile } from './extract-toc';
import { extractToc } from './extract-toc';

// Cache MDX compilation results in production only, with bounded size
const mdxCache = new Map<
  string,
  {
    code: string;
    // biome-ignore lint/suspicious/noExplicitAny: this is how frontmatter is typed in mdx-bundler
    frontmatter: { [key: string]: any };
    toc: TableOfContentsItem[];
  }
>();

const MAX_CACHE_ENTRIES = 200;

const getCacheKey = (fileContent: string, cacheKey?: string) =>
  cacheKey ?? createHash('sha256').update(fileContent).digest('hex');

export const generateFromMdx = async (
  fileContent: string,
  cacheKey?: string,
): Promise<{
  code: string;
  // biome-ignore lint/suspicious/noExplicitAny: this is how frontmatter is typed in mdx-bundler
  frontmatter: { [key: string]: any };
  toc: TableOfContentsItem[];
}> => {
  const shouldUseCache = process.env.NODE_ENV === 'production';
  const resolvedCacheKey = getCacheKey(fileContent, cacheKey);

  if (shouldUseCache) {
    const cached = mdxCache.get(resolvedCacheKey);
    if (cached) return cached;
  }

  let tocData: TableOfContentsItem[] = [];

  const result = await bundleMDX({
    source: fileContent,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append' }],
        () => (tree: Root, file: VFile) => {
          extractToc()(tree, file);
          tocData = file.data.toc || [];
        },
      ];

      return options;
    },
  });

  const output = {
    ...result,
    toc: tocData,
  };

  if (shouldUseCache) {
    if (mdxCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = mdxCache.keys().next().value;
      if (oldestKey) {
        mdxCache.delete(oldestKey);
      }
    }
    mdxCache.set(resolvedCacheKey, output);
  }

  return output;
};
