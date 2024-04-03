'use client';

import type { QueryResponseInitial } from '@sanity/react-loader';
import { useQuery } from '@sanity/react-loader';
import type { SanityDocument } from 'next-sanity';

import { BLOG_POSTS_QUERY } from '../../../sanity/lib/queries';

import { Posts } from './Posts';

export function PostsPreview({
  initial,
}: {
  initial: QueryResponseInitial<SanityDocument[]>;
}) {
  const { data } = useQuery<SanityDocument[] | null>(
    BLOG_POSTS_QUERY,
    {},
    { initial },
  );

  return data ? (
    <Posts posts={data} />
  ) : (
    <div className='bg-red-100'>Post not found</div>
  );
}
