/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { QueryParams, SanityDocument } from 'next-sanity';
import dynamic from 'next/dynamic';
import type { GetStaticPaths } from 'next';

import { Post } from 'components/Blog/Post/Post';

import { getClient } from '../../sanity/lib/client';
import { token } from '../../sanity/lib/token';
import {
  BLOG_POSTS_SLUG_QUERY,
  BLOG_POST_QUERY,
} from '../../sanity/lib/queries';

const PostPreview = dynamic(
  () => import('../../components/Blog/Post/PostPreview'),
);

type PageProps = {
  post: SanityDocument;
  params: QueryParams;
  draftMode: boolean;
  token: string;
};

export default function SinglePost(props: PageProps) {
  return props.draftMode ? (
    <PostPreview
      post={props.post}
      params={props.params}
    />
  ) : (
    <Post post={props.post} />
  );
}

export const getStaticProps = async ({ params = {}, draftMode = false }) => {
  const client = getClient(draftMode ? token : undefined);
  const post = await client.fetch<SanityDocument>(BLOG_POST_QUERY, params);

  return {
    props: {
      post,
      params,
      draftMode,
      token: draftMode ? token : '',
    },
  };
};

// Prepare Next.js to know which routes already exist
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getClient().fetch(BLOG_POSTS_SLUG_QUERY);
  return { paths, fallback: true };
};
