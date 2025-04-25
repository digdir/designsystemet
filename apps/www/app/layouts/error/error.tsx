import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';
import '../../app.css';
import { SkipLink } from '@digdir/designsystemet-react';
import { Footer, Header } from '@repo/components';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import { Error404 } from '~/_components/errors/error-404';
import type { Route } from './+types/error';

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://altinncdn.no/fonts/inter/v4.1/inter.css',
      integrity:
        'sha384-OcHzc/By/OPw9uJREawUCjP2inbOGKtKb4A/I2iXxmknUfog2H8Adx71tWVZRscD',
      crossOrigin: 'anonymous',
    },
  ];
};

export const handle = {
  i18n: 'common',
};

export const meta = () => {
  return [
    {
      title: 'Designsystemet',
    },
    { description: 'En digital verktøykasse' },
  ];
};

export const loader = async ({ params }: Route.LoaderArgs) => {
  const lang = params.lang;

  const centerLinks = [
    {
      text: 'footer.about',
      url: 'https://designsystemet.no/grunnleggende/introduksjon/om-designsystemet',
    },
    {
      text: 'footer.privacy',
      url: `${lang}/grunnleggende/privacy-policy`,
    },
    {
      text: 'footer.accessibility',
      url: 'https://uustatus.no/nb/erklaringer/publisert/faeb324d-9b3f-40b0-b715-92cac356a916',
    },
  ];

  /* useChangeLanguage(lang); */
  const menu = [
    {
      name: 'navigation.fundamentals',
      href: `/${lang}/grunnleggende`,
    },
    {
      name: 'navigation.best-practices',
      href: `/${lang}/god-praksis`,
    },
    {
      name: 'navigation.patterns',
      href: `/${lang}/monstre`,
    },
    {
      name: 'navigation.blog',
      href: `/${lang}/bloggen`,
    },
    {
      name: 'navigation.components',
      href: `/${lang}/komponenter`,
    },
    {
      name: 'navigation.theme-builder',
      href: 'https://theme.designsystemet.no',
    },
  ];

  return { lang: params.lang, centerLinks, menu };
};

export default function Root({ loaderData: { lang } }: Route.ComponentProps) {
  const { i18n } = useTranslation();
  useChangeLanguage(lang);

  return (
    <html lang={lang} data-color-scheme='auto' dir={i18n.dir()}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

type ErrorWrapperRootProps = {
  children: React.ReactNode;
  lang: string;
  menu: {
    name: string;
    href: string;
  }[];
  centerLinks: {
    text: string;
    url: string;
  }[];
  rightLinks: {
    text: string;
    url: string;
    prefix?: React.ReactNode;
  }[];
};

const ErrorWrapperRoot = ({
  children,
  menu,
  centerLinks,
  rightLinks,
  lang,
}: ErrorWrapperRootProps) => {
  const { t } = useTranslation();
  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header menu={menu} logoLink={`/${lang}`} themeSwitcher />
      <main id='main'>
        <ContentContainer>{children}</ContentContainer>
      </main>
      <Footer centerLinks={centerLinks} rightLinks={[]} />
    </>
  );
};

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  const message = t('errors.default.title');
  let details = t('errors.default.details');
  let stack: string | undefined;

  console.log({ loaderData });

  if (!loaderData) {
    return <Error404 />;
  }

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <ErrorWrapperRoot {...loaderData} rightLinks={[]}>
          <Error404 />
        </ErrorWrapperRoot>
      );
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <ErrorWrapperRoot {...loaderData} rightLinks={[]}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </ErrorWrapperRoot>
  );
}
