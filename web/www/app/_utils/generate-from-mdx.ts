import { bundleMDX } from 'mdx-bundler';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const generateFromMdx = async (
  fileContent: string,
): ReturnType<typeof bundleMDX> => {
  return await bundleMDX({
    source: fileContent,
    mdxOptions(options, frontmatter) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
      ];

      return options;
    },
  });
};
