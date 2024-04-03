'use client';

import type { QueryResponseInitial } from '@sanity/react-loader';
import { useQuery } from '@sanity/react-loader';
import type { SanityDocument } from 'next-sanity';

import { FOOTER_QUERY } from '../../sanity/lib/queries';

import { Footer } from './Footer';

export function FooterPreview({
  initial,
}: {
  initial: QueryResponseInitial<SanityDocument[]>;
}) {
  const { data } = useQuery<SanityDocument[] | null>(
    FOOTER_QUERY,
    {},
    { initial },
  );

  return data ? (
    <Footer data={data} />
  ) : (
    <div className='bg-red-100'>Post not found</div>
  );
}
