'use client';

import type { QueryResponseInitial } from '@sanity/react-loader';
import { useQuery } from '@sanity/react-loader';
import type { QueryParams, SanityDocument } from 'next-sanity';

import { BLOG_POST_QUERY } from '../../../sanity/lib/queries';

import { Post } from './Post';

export function PostPreview({
  initial,
  params,
}: {
  initial: QueryResponseInitial<SanityDocument>;
  params: QueryParams;
}) {
  const { data } = useQuery<SanityDocument | null>(BLOG_POST_QUERY, params, {
    initial,
  });

  return data ? (
    <Post post={data} />
  ) : (
    <div className='bg-red-100'>Post not found</div>
  );
}
