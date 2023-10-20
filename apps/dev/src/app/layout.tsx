import 'normalize.css/normalize.css';
import './globals.css';

export const metadata = {
  title: 'Dev - Designsystemet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
