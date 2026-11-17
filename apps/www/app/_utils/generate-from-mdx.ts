import type { Root } from 'hast';
import { bundleMDX } from 'mdx-bundler';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { TableOfContentsItem, VFile } from './extract-toc';
import { extractToc } from './extract-toc';
import { prettifyCodeBlocks } from './prettify-code-blocks';

// Cache MDX compilation results by source content to avoid recompiling identical files
const mdxCache = new Map<
  string,
  {
    code: string;
    // biome-ignore lint/suspicious/noExplicitAny: this is how frontmatter is typed in mdx-bundler
    frontmatter: { [key: string]: any };
    toc: TableOfContentsItem[];
  }
>();

export const generateFromMdx = async (
  fileContent: string,
): Promise<{
  code: string;
  // biome-ignore lint/suspicious/noExplicitAny: this is how frontmatter is typed in mdx-bundler
  frontmatter: { [key: string]: any };
  toc: TableOfContentsItem[];
}> => {
  const cached = mdxCache.get(fileContent);
  if (cached) return cached;

  let tocData: TableOfContentsItem[] = [];

  const result = await bundleMDX({
    source: fileContent,
    // A real directory, so esbuild can resolve imports in the MDX itself (see esbuildOptions).
    cwd: process.cwd(),
    esbuildOptions(options) {
      // mdx-bundler's own resolver only knows the CommonJS `main` field, which esbuild can't
      // tree-shake: importing one icon in an .mdx file put the whole icon set (2.4 MB) in the
      // page data. Without it esbuild resolves the ES modules and keeps only what is imported.
      options.plugins = options.plugins?.filter(
        (plugin) => plugin.name !== 'node-resolve',
      );
      return options;
    },
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append' }],
        prettifyCodeBlocks,
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
  mdxCache.set(fileContent, output);
  return output;
};
