/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { QueryParams, SanityDocument } from 'next-sanity';
import { useLiveQuery } from 'next-sanity/preview';

import { BLOG_POST_QUERY } from '../../../sanity/lib/queries';

import { Post } from './Post';

export default function PostPreview({
  post,
  params = {},
}: {
  post: SanityDocument;
  params: QueryParams;
}) {
  const [data] = useLiveQuery<SanityDocument>(post, BLOG_POST_QUERY, params);

  return <Post post={data} />;
}
