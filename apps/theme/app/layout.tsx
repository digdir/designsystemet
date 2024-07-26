import type { Metadata } from 'next';
import './globals.css';
import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';
import { Header } from '@repo/components';

export const metadata: Metadata = {
  title: 'Temabygger - Designsystemet',
  description: 'Bygg ditt eget tema med designsystemet',
};

const menu = [
  /* {
    name: 'Fargevelger',
    href: '/',
  }, */
  {
    name: 'Testside',
    href: '/testside',
  },
  {
    name: 'Om verktøyet',
    href: '/om-verktoyet',
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='no'>
      <body>
        <Header
          menu={menu}
          betaTag
        />
        {children}
      </body>
    </html>
  );
}
