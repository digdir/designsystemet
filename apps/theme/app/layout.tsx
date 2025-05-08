import type { Metadata } from 'next';

import '@digdir/designsystemet-css';
import '@digdir/designsystemet-theme';
import 'react-color-palette/css';
import './globals.css';
import { Figma, Footer, Github, Header, Slack } from '@internal/components';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';

export const metadata: Metadata = {
  title: 'Temabygger - Designsystemet',
  description: 'Bygg ditt eget tema med designsystemet',
};

const menu = [
  {
    name: 'Grunnleggende',
    href: 'https://www.designsystemet.no/grunnleggende',
  },
  {
    name: 'God praksis',
    href: 'https://www.designsystemet.no/god-praksis',
  },
  {
    name: 'Mønstre',
    href: 'https://www.designsystemet.no/monstre',
  },
  {
    name: 'Bloggen',
    href: 'https://www.designsystemet.no/bloggen',
  },
  {
    name: 'Komponenter',
    href: 'https://www.designsystemet.no/komponenter',
  },
  {
    name: 'Temabygger',
    href: '/',
  },
];

const centerLinks = [
  {
    text: 'Om designsystemet',
    url: 'https://designsystemet.no/grunnleggende/introduksjon/om-designsystemet',
  },
  {
    text: 'Personvernerklæring',
    url: 'https://designsystemet.no/grunnleggende/personvernerklaering',
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
    url: 'https://designsystemet.no/slack',
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
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='no'>
      <body>
        <Header
          menu={menu}
          transparentBackground
          logoLink='https://www.designsystemet.no/'
          themeSwitcher
        />
        <div className='content'>{children}</div>
        <Footer centerLinks={centerLinks} rightLinks={rightLinks} />
      </body>
    </html>
  );
}
