import React from 'react';
import 'normalize.css/normalize.css';
import 'tippy.js/dist/tippy.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '../globals.css';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

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
      <main className={inter.className}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </main>
    </QueryClientProvider>
  );
};

export default MyApp;
