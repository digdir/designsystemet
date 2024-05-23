import '../globals.css';
import '../../legacy-tokens.css'; // TODO temp fix because of silly symlinks for theme package
import '@digdir/designsystemet-css';

import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import { SkipLink } from '@digdir/designsystemet-react';

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
