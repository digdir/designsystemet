import { draftMode } from 'next/headers';
import type { QueryResponseInitial } from '@sanity/react-loader';
import type { SanityDocument } from 'next-sanity';

import { Footer, FooterPreview } from '@components';

type FooterVisualEditProps = {
  initial: QueryResponseInitial<SanityDocument[]>;
};

const HeaderVisualEdit = ({ initial }: FooterVisualEditProps) => {
  return draftMode().isEnabled ? (
    <FooterPreview initial={initial} />
  ) : (
    <Footer data={initial.data} />
  );
};

export default HeaderVisualEdit;
