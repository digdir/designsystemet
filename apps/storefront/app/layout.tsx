import '../globals.css';
import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';

import { SkipLink } from '@digdir/designsystemet-react';
import { Figma, Github, Header, Slack } from '@internal/components';
import { Footer } from '@internal/components';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import type { Metadata } from 'next';
import Script from 'next/script';
import { isProduction } from '../utils/is-production';

const subdomain = isProduction() ? '' : 'next.';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${subdomain}designsystemet.no`),
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
  {
    name: 'Temabygger',
    href: `https://${subdomain}theme.designsystemet.no`,
  },
];

const centerLinks = [
  {
    text: 'Om designsystemet',
    url: '/grunnleggende/introduksjon/om-designsystemet',
  },
  {
    text: 'Personvernerklæring',
    url: '/grunnleggende/personvernerklaering',
  },
  {
    text: 'Tilgjengelighetserklæring',
    url: 'https://uustatus.no/nb/erklaringer/publisert/faeb324d-9b3f-40b0-b715-92cac356a916',
  },
];

const rightLinks = [
  {
    text: 'designsystem@digdir.no',
    url: 'mailto:designsystem@digdir.no',
    prefix: <EnvelopeClosedIcon aria-hidden='true' fontSize='1.5em' />,
  },
  {
    text: 'Bli invitert til slack',
    url: '/slack',
    prefix: <Slack />,
  },
  {
    text: 'Github',
    url: 'https://github.com/digdir/designsystemet',
    prefix: <Github />,
  },
  {
    text: 'Figma',
    url: 'https://www.figma.com/@designsystemet',
    prefix: <Figma />,
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
    <html lang='no' data-color-scheme='auto'>
      <body>
        <div className='root'>
          <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
          <Header menu={menu} skipLink={false} themeSwitcher={true} />
          {children}
          <Footer centerLinks={centerLinks} rightLinks={rightLinks} />
          {process.env.VERCEL_ENV === 'production' && (
            <Script src='https://siteimproveanalytics.com/js/siteanalyze_6255470.js' />
          )}
        </div>
      </body>
    </html>
  );
}
