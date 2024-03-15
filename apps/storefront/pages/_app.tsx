import 'normalize.css/normalize.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/designsystemet-theme/brand/digdir/tokens.css';

import '../globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SkipLink } from '@digdir/design-system-react';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className='root'>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <Header />
      <Component {...pageProps} />
      <Footer />
      <Analytics />
    </div>
  );
};

export default MyApp;
