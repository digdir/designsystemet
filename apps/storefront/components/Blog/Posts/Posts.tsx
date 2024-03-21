/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { useLiveQuery } from 'next-sanity/preview';
import type { SanityDocument } from 'next-sanity';

import BlogCard from 'components/Blog/Card/BlogCard';

import { BLOG_POSTS_QUERY } from '../../../sanity/lib/queries';
import { getUrl } from '../../../sanity/lib/imageBuilder';

const PostsPreview = ({ posts = [] }: { posts: SanityDocument[] }) => {
  const [data] = useLiveQuery<SanityDocument[]>(posts, BLOG_POSTS_QUERY);
  return <Posts posts={data} />;
};

const Posts = ({ posts }) => {
  return posts.map((post, index) => (
    <>
      <BlogCard
        key={index}
        title={post.title}
        desc={post.ingress}
        date='5. desember 2023'
        href={'/bloggen/' + post.slug.current}
        image={getUrl(post.image)}
        author='Digdir'
        featured={index === 0}
      />
    </>
  ));
};
export { PostsPreview, Posts };
