import { draftMode } from 'next/headers';
import type { QueryParams, SanityDocument } from 'next-sanity';
import type { QueryResponseInitial } from '@sanity/react-loader';

import { Post, PostPreview } from '@components';

import {
  BLOG_POST_QUERY,
  BLOG_POSTS_QUERY,
  MENU_QUERY,
  FOOTER_QUERY,
} from '../../../sanity/lib/queries';
import { client } from '../../../sanity/lib/client';
import HeaderVisualEdit from '../../../components/Header/HeaderVisualEdit';
import FooterVisualEdit from '../../../components/Footer/FooterVisualEdit';
import { getDocuments, getDocument } from '../../../sanity/lib/loaders';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await client.fetch<SanityDocument[]>(BLOG_POSTS_QUERY);

  return posts.map((post: SanityDocument) => ({
    slug: post.slug.current,
  }));
}

const PostVisualEdit = ({
  initial,
  params,
}: {
  initial: QueryResponseInitial<SanityDocument>;
  params: QueryParams;
}) => {
  return draftMode().isEnabled ? (
    <PostPreview
      initial={initial}
      params={params}
    />
  ) : (
    <Post post={initial.data} />
  );
};

export default async function BlogPost({ params }: { params: QueryParams }) {
  const initialMenu = await getDocuments(MENU_QUERY);
  const initialPost = await getDocument(BLOG_POST_QUERY, params);
  const initialFooter = await getDocuments(FOOTER_QUERY);
  console.log(initialPost.data.content);
  return (
    <div>
      <HeaderVisualEdit initialMenu={initialMenu} />
      <PostVisualEdit
        initial={initialPost}
        params={params}
      />
      <FooterVisualEdit initial={initialFooter} />
    </div>
  );
}
