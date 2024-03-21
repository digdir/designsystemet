/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { SanityDocument } from 'next-sanity';
import { useLiveQuery } from 'next-sanity/preview';

import { MENU_QUERY } from '../../sanity/lib/queries';

import { Header } from './Header';

const HeaderPreview = ({ menu }: { menu: SanityDocument[] }) => {
  const [menuData] = useLiveQuery<SanityDocument[]>(menu, MENU_QUERY);
  console.log(menuData);

  return <Header menu={menuData[0].menu} />;
};

export { HeaderPreview };
