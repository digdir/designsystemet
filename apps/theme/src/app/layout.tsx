import type { Metadata } from 'next';
import './globals.css';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';

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
      <body>{children}</body>
    </html>
  );
}
