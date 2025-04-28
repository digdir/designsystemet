import { SkipLink } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
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

export default function RootLayout({
  loaderData: { lang },
}: Route.ComponentProps) {
  const { t } = useTranslation();

  const centerLinks = [
    {
      text: t('footer.about'),
      url: 'https://designsystemet.no/grunnleggende/introduksjon/om-designsystemet',
    },
    {
      text: t('footer.privacy'),
      url: 'https://designsystemet.no/grunnleggende/personvernerklaering',
    },
    {
      text: t('footer.accessibility'),
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
      text: t('footer.slack'),
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

  /* useChangeLanguage(lang); */
  const menu = [
    {
      name: t('navigation.fundamentals'),
      href: `/${lang}/grunnleggende`,
    },
    {
      name: t('navigation.best-practices'),
      href: `/${lang}/god-praksis`,
    },
    {
      name: t('navigation.patterns'),
      href: `/${lang}/monstre`,
    },
    {
      name: t('navigation.blog'),
      href: `/${lang}/bloggen`,
    },
    {
      name: t('navigation.components'),
      href: `/${lang}/komponenter`,
    },
    {
      name: t('navigation.theme-builder'),
      href: 'https://theme.designsystemet.no',
    },
  ];
  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header menu={menu} logoLink={`/${lang}`} themeSwitcher />
      <main id='main'>
        <Outlet />
      </main>
      <Footer centerLinks={centerLinks} rightLinks={rightLinks} />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  let message = t('errors.default.title');
  let details = t('errors.default.details');
  let stack: string | undefined;

  console.log(error);

  if (isRouteErrorResponse(error)) {
    message =
      error.status === 404 ? t('errors.404.title') : t('errors.generic.title');
    details =
      error.status === 404
        ? t('errors.404.details')
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
