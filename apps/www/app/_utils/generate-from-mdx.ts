import type { Root } from 'hast';
import { bundleMDX } from 'mdx-bundler';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { TableOfContentsItem, VFile } from './extract-toc';
import { extractToc } from './extract-toc';

type MdxTransform = (tree: Root) => void;

// Cache MDX compilation results by source content to avoid recompiling identical files
const mdxCache = new Map<
  MdxTransform | undefined,
  Map<
    string,
    {
      code: string;
      // biome-ignore lint/suspicious/noExplicitAny: this is how frontmatter is typed in mdx-bundler
      frontmatter: { [key: string]: any };
      toc: TableOfContentsItem[];
    }
  >
>();

export const generateFromMdx = async (
  fileContent: string,
  transform?: MdxTransform,
): Promise<{
  code: string;
  // biome-ignore lint/suspicious/noExplicitAny: this is how frontmatter is typed in mdx-bundler
  frontmatter: { [key: string]: any };
  toc: TableOfContentsItem[];
}> => {
  const cache = mdxCache.get(transform) ?? new Map();
  mdxCache.set(transform, cache);
  const cached = cache.get(fileContent);
  if (cached) return cached;

  let tocData: TableOfContentsItem[] = [];

  const result = await bundleMDX({
    source: fileContent,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        () => (tree: Root) => transform?.(tree),
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
  cache.set(fileContent, output);
  return output;
};
