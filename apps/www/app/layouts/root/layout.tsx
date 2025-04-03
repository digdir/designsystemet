import { SkipLink } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { Outlet } from 'react-router';
import { Footer } from '~/_components/footer/footer';
import { Header } from '~/_components/header/header';
import { Figma } from '~/_components/logos/Figma';
import { Github } from '~/_components/logos/Github';
import { Slack } from '~/_components/logos/Slack';
import type { Route } from './+types/layout';

export const loader = ({ params: { lang } }: Route.LoaderArgs) => {
  return {
    lang,
  };
};

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
  loaderData: { lang },
}: Route.ComponentProps) {
  const menu = [
    {
      name: 'Mønstre',
      href: `/${lang}/monstre`,
    },
    {
      name: 'Bloggen',
      href: `/${lang}/bloggen`,
    },
  ];
  return (
    <>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <Header menu={menu} logoLink={`/${lang}`} />
      <main id='main'>
        <Outlet />
      </main>
      <Footer centerLinks={centerLinks} rightLinks={rightLinks} />
    </>
  );
}
