import 'normalize.css/normalize.css';
import './globals.css';

import type { ReactNode } from 'react';

export const metadata = {
  title: 'Dev - Designsystemet',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
