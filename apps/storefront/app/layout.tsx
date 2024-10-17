import '../globals.css';
import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';

import { Figma, Github, Header, Slack } from '@repo/components';
import type { Metadata } from 'next';

import { VersionBanner } from '@components';
import { SkipLink } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { Footer } from '@repo/components';
import Script from 'next/script';

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
  /* {
    name: 'Temabygger',
    href: 'https://next.theme.designsystemet.no',
  }, */
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
    url: 'https://join.slack.com/t/designsystemet/shared_invite/zt-2438eotl3-a4266Vd2IeqMWO8TBw5PrQ',
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
    <html lang='en'>
      <body>
        <div className='root'>
          <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
          <VersionBanner />
          <Header menu={menu} skipLink={false} />
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
