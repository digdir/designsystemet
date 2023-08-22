import React from 'react';
import 'normalize.css/normalize.css';
import 'tippy.js/dist/tippy.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import '@navikt/ds-css';
import '../globals.css';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import cn from 'classnames';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { JumpToMain } from '../components/JumpToMain';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'fallback',
});

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn(inter.className, 'root')}>
        <JumpToMain />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default MyApp;
