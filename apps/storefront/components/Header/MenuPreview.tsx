/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { QueryParams, SanityDocument } from 'next-sanity';
import { useLiveQuery } from 'next-sanity/preview';

import { MENU_QUERY } from '../../sanity/lib/queries';

import { Menu } from './Menu';

export default function MenuPreview({
  post,
  params = {},
}: {
  post: SanityDocument;
  params: QueryParams;
}) {
  const [menu] = useLiveQuery<SanityDocument>(post, MENU_QUERY, params);

  return <Menu data={menu} />;
}
