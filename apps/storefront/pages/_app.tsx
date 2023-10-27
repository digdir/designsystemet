import React from 'react';
import 'normalize.css/normalize.css';
import 'tippy.js/dist/tippy.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import '@navikt/ds-css';
import '../globals.css';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { JumpToMain } from '../components/JumpToMain';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className='root'>
      <JumpToMain />
      <Header />
      <Component {...pageProps} />
      <Footer />
      <Analytics />
    </div>
  );
};

export default MyApp;
