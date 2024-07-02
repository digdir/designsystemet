import '../globals.css';
import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';

import { Analytics } from '@vercel/analytics/react';
import { SkipLink } from '@digdir/designsystemet-react';
import type { Metadata } from 'next';

import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s - Designsystemet',
    default: 'Designsystemet',
  },
  openGraph: {
    images: '/img/designsystemet-meta.png',
  },
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div className='root'>
          <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
          <Header />
          {children}
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
