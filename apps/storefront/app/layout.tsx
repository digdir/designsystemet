import '../globals.css';
import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';

import { Header } from '@repo/components';
import type { Metadata } from 'next';

import { VersionBanner } from '@components';
import Script from 'next/script';
import { Footer } from '../components/Footer/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_GIT_COMMIT_REF !== 'main'
      ? 'https://next.designsystemet.no'
      : 'https://designsystemet.no',
  ),
  title: {
    template: '%s - Designsystemet',
    default: 'Designsystemet',
  },
  openGraph: {
    images: '/img/designsystemet-meta.png',
  },
};

const menu = [
  {
    name: 'Grunnleggende',
    href: '/grunnleggende',
  },
  {
    name: 'God praksis',
    href: '/god-praksis',
  },
  {
    name: 'Mønstre',
    href: '/monstre',
  },
  {
    name: 'Bloggen',
    href: '/bloggen',
  },
  {
    name: 'Komponenter',
    href: '/komponenter',
  },
];

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
          <VersionBanner />
          <Header menu={menu} />
          {children}
          <Footer />
          {process.env.VERCEL_GIT_COMMIT_REF === 'main' && (
            <Script src='https://siteimproveanalytics.com/js/siteanalyze_6255470.js' />
          )}
        </div>
      </body>
    </html>
  );
}
