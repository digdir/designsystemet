/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { QueryParams, SanityDocument } from 'next-sanity';
import { useLiveQuery } from 'next-sanity/preview';

import { FOOTER_QUERY } from '../../sanity/lib/queries';

import { Footer } from './Footer';

export default function PostPreview({
  post,
  params = {},
}: {
  post: SanityDocument;
  params: QueryParams;
}) {
  const [data] = useLiveQuery<SanityDocument>(post, FOOTER_QUERY, params);

  return <Footer data={data} />;
}
