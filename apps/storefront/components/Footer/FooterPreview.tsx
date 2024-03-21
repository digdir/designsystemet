/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { SanityDocument } from 'next-sanity';
import { useLiveQuery } from 'next-sanity/preview';

import { FOOTER_QUERY } from '../../sanity/lib/queries';

import { Footer } from './Footer';

const FooterPreview = ({ data }: { data: SanityDocument[] }) => {
  const [footerData] = useLiveQuery<SanityDocument[]>(data, FOOTER_QUERY);

  return <Footer data={footerData} />;
};

export { FooterPreview };
