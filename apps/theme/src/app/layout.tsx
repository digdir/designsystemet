import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../css/bootstrap-grid.css';
import './globals.css';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Temabygger - Designsystemet',
  description: 'Bygg ditt eget tema med designsystemet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='no'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
