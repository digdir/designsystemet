'use client';

import type { QueryResponseInitial } from '@sanity/react-loader';
import { useQuery } from '@sanity/react-loader';
import type { SanityDocument } from 'next-sanity';

import { MENU_QUERY } from '../../sanity/lib/queries';

import { Header } from './Header';

export function HeaderPreview({
  initial,
}: {
  initial: QueryResponseInitial<SanityDocument[]>;
}) {
  const { data } = useQuery<SanityDocument[] | null>(
    MENU_QUERY,
    {},
    { initial },
  );

  return data ? (
    <Header menu={data} />
  ) : (
    <div className='bg-red-100'>Post not found</div>
  );
}
