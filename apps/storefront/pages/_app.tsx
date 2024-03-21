import 'normalize.css/normalize.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/designsystemet-theme/brand/digdir/tokens.css';
import { lazy, Suspense } from 'react';
import '../globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SkipLink } from '@digdir/design-system-react';
import { VisualEditing } from '@sanity/visual-editing/next-pages-router';

import { Header } from '../components/Header/Header';

const PreviewProvider = lazy(
  () => import('../components/PreviewProvider/PreviewProvider'),
);

export interface SharedPageProps {
  draftMode: boolean;
  token: string;
}

const MyApp = ({ Component, pageProps }: AppProps<SharedPageProps>) => {
  const { draftMode, token } = pageProps;

  return draftMode ? (
    <PreviewProvider token={token}>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <Component {...pageProps} />
      <Suspense>
        <VisualEditing />
      </Suspense>
    </PreviewProvider>
  ) : (
    <>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
};

export default MyApp;
