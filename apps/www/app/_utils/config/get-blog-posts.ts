import { join } from 'node:path';
import { bundleMDX } from 'mdx-bundler';
import i18n from '../../i18next.server';
import { getFileFromContentDir, getFilesFromContentDir } from '../files.server';
import { defaultCoverImagePath, type PageMetadata } from '../metadata';

export interface BlogPosts {
  lang: string;
  posts: {
    title: string;
    author: string;
    description: string;
    url: string;
    date: string;
    image: {
      src: string;
      alt: string;
    };
    searchTerms: string[];
  }[];
  metadata: PageMetadata;
}

export async function getBlogPosts(lang: string): Promise<BlogPosts> {
  /* Get all files in /content/blog for the lang we have selected */
  const files = getFilesFromContentDir(join('blog', lang));

  /* Filter out files that are not .mdx */
  const mdxFiles = files.filter((file) => file.relativePath.endsWith('.mdx'));

  /* Get titles and URLs for all files */
  const posts: BlogPosts['posts'] = [];

  const t = await i18n.getFixedT(lang);

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('blog', lang, file.relativePath),
    );
    const result = await bundleMDX({
      source: fileContent,
    });

    const title =
      result.frontmatter.title || file.relativePath.replace('.mdx', '');
    const url = file.relativePath.replace('.mdx', '');
    const searchTerms: string[] = [];
    if (typeof result.frontmatter.search_terms === 'string')
      result.frontmatter.search_terms
        .split(',')
        .map((term) => searchTerms.push(term));

    posts.push({
      title,
      author: result.frontmatter.author || 'Unknown Author',
      description: result.frontmatter.description || 'No description available',
      url,
      date: result.frontmatter.date || '2000-01-01',
      image: {
        src: result.frontmatter.imageSrc || defaultCoverImagePath,
        alt: result.frontmatter.imageAlt || t('meta.meta-cover'),
      },
      searchTerms,
    });
  }

  /* Sort posts by date */
  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return {
    lang,
    posts,
    metadata: {
      title: t('blog.title'),
      description: t('blog.description'),
    },
  };
}
