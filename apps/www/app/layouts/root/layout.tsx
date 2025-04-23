import { SkipLink } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { Outlet, isRouteErrorResponse } from 'react-router';
import { Footer } from '~/_components/footer/footer';
import { Header } from '~/_components/header/header';
import { Figma } from '~/_components/logos/figma';
import { Github } from '~/_components/logos/github';
import { Slack } from '~/_components/logos/slack';
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
      name: 'Grunnleggende',
      href: `/${lang}/grunnleggende`,
    },
    {
      name: 'God praksis',
      href: `/${lang}/god-praksis`,
    },
    {
      name: 'Mønstre',
      href: `/${lang}/monstre`,
    },
    {
      name: 'Bloggen',
      href: `/${lang}/bloggen`,
    },
    {
      name: 'Komponenter',
      href: `/${lang}/komponenter`,
    },
    {
      name: 'Temabygger',
      href: 'https://theme.designsystemet.no',
    },
  ];
  return (
    <>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <Header menu={menu} logoLink={`/${lang}`} themeSwitcher />
      <main id='main'>
        <Outlet />
      </main>
      <Footer centerLinks={centerLinks} rightLinks={rightLinks} />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  console.log(error);

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.!'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
