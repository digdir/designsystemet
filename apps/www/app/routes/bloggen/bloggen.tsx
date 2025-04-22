import { join } from 'node:path';
import { bundleMDX } from 'mdx-bundler';
import BlogCard from '~/_components/blog-card/blog-card';
import { getFileFromContentDir, getFilesFromContentDir } from '~/_utils/files';
import { generateMetadata } from '~/_utils/metadata';
import type { Route } from './+types';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  /* Get all files in /content/bloggen for the lang we have selected */
  const files = getFilesFromContentDir(join('bloggen', lang));

  /* Filter out files that are not .mdx */
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  /* Get titles and URLs for all files */
  const posts: {
    title: string;
    author: string;
    description: string;
    url: string;
    date: string;
    image: {
      src: string;
      alt: string;
    };
  }[] = [];

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(join('bloggen', lang, `${file}`));
    const result = await bundleMDX({
      source: fileContent,
    });

    const title = result.frontmatter.title || file.replace('.mdx', '');
    const url = file.replace('.mdx', '');
    posts.push({
      title,
      author: result.frontmatter.author || 'Unknown Author',
      description: result.frontmatter.description || 'No description available',
      url,
      date: result.frontmatter.date || '2000-01-01',
      image: {
        src: result.frontmatter.imageSrc || '',
        alt: result.frontmatter.imageAlt || '',
      },
    });
  }

  /* Sort posts by date */
  posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return { lang, posts };
};

export const meta = () => {
  return generateMetadata({
    title: 'Bloggen',
    description: 'Les blogginlegg fra kjerneteamet og konsumenter',
  });
};

export default function Monstre({
  loaderData: { posts },
}: Route.ComponentProps) {
  return (
    <>
      {posts.map((post, index) => {
        return (
          <BlogCard
            key={post.url}
            title={post.title}
            desc={post.description}
            author={post.author}
            image={post.image.src}
            href={post.url}
            featured={index === 0}
          />
        );
      })}
    </>
  );
}
