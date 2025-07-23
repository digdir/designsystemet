import type { Root } from 'hast';
import { bundleMDX } from 'mdx-bundler';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { TableOfContentsItem, VFile } from './extract-toc';
import { extractToc } from './extract-toc';

export const generateFromMdx = async (
  fileContent: string,
): Promise<{
  code: string;
  // biome-ignore lint/suspicious/noExplicitAny: this is how frontmatter is typed in mdx-bundler
  frontmatter: { [key: string]: any };
  toc: TableOfContentsItem[];
}> => {
  let tocData: TableOfContentsItem[] = [];

  const result = await bundleMDX({
    source: fileContent,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        () => (tree: Root, file: VFile) => {
          extractToc()(tree, file);
          tocData = file.data.toc || [];
        },
      ];

      return options;
    },
  });

  return {
    ...result,
    toc: tocData,
  };
};
