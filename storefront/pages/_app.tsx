import React from 'react';
import 'normalize.css/normalize.css';
import 'tippy.js/dist/tippy.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import '../globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import cn from 'classnames';
import { Analytics } from '@vercel/analytics/react';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { JumpToMain } from '../components/JumpToMain';

import classes from './_app.module.css';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn(classes.appRoot, 'root')}>
        <JumpToMain />
        <Header />
        <Component {...pageProps} />
        <Footer />
        <Analytics />
      </div>
    </QueryClientProvider>
  );
};

export default MyApp;
