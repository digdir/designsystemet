import { draftMode } from 'next/headers';
import type { QueryResponseInitial } from '@sanity/react-loader';
import type { SanityDocument } from 'next-sanity';

import { Header, HeaderPreview } from '@components';

type HeaderVisualEditProps = {
  initialMenu: QueryResponseInitial<SanityDocument[]>;
};

const HeaderVisualEdit = ({ initialMenu }: HeaderVisualEditProps) => {
  return draftMode().isEnabled ? (
    <HeaderPreview initial={initialMenu} />
  ) : (
    <Header menu={initialMenu.data} />
  );
};

export default HeaderVisualEdit;
