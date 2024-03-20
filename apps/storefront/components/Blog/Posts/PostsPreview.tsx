import type { SanityDocument } from 'next-sanity';
import { useLiveQuery } from 'next-sanity/preview';

import { BLOG_POSTS_QUERY } from '../../../sanity/lib/queries';

import { Posts } from './Posts';

const PostsPreview = ({ posts = [] }: { posts: SanityDocument[] }) => {
  const [data] = useLiveQuery<SanityDocument[]>(posts, BLOG_POSTS_QUERY);

  return <Posts posts={data} />;
};

export default PostsPreview;
