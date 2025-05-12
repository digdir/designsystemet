import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  redirect,
} from 'react-router';
import type { Route } from './+types/root';
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';
import './app.css';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import { Error404 } from './_components/errors/error-404';

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

export const meta = () => {
  return [
    {
      title: 'Designsystemet',
    },
    { description: 'En digital verktøykasse' },
  ];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request?.url || '');
  /* if the url is slack, then redirect to slack */
  if (url.pathname === '/slack') {
    return redirect(
      process.env.SLACK_INVITE_URL ?? 'https://designsystemet.no',
    );
  }

  if (params.lang === undefined) {
    return redirect('/no');
  }

  if (params.lang !== 'no' && params.lang !== 'en') {
    return redirect('/no');
  }

  const lang = params.lang;

  const centerLinks = [
    {
      text: 'footer.about',
      url: `${lang}/fundamentals/introduction/about-the-design-system`,
    },
    {
      text: 'footer.privacy',
      url: `${lang}/fundamentals/privacy-policy`,
    },
    {
      text: 'footer.accessibility',
      url: 'https://uustatus.no/nb/erklaringer/publisert/faeb324d-9b3f-40b0-b715-92cac356a916',
    },
  ];

  const menu = [
    {
      name: 'navigation.fundamentals',
      href: `/${lang}/fundamentals`,
    },
    {
      name: 'navigation.best-practices',
      href: `/${lang}/best-practices`,
    },
    {
      name: 'navigation.patterns',
      href: `/${lang}/patterns`,
    },
    {
      name: 'navigation.blog',
      href: `/${lang}/blog`,
    },
    {
      name: 'navigation.components',
      href: `/${lang}/components`,
    },
    {
      name: 'navigation.theme-builder',
      href: 'https://theme.designsystemet.no',
    },
  ];

  return data({ lang: params.lang, centerLinks, menu });
};

export function Layout() {
  const { i18n } = useTranslation();

  return (
    <html
      lang={i18n.language}
      dir={i18n.dir(i18n.language)}
      data-color-scheme='auto'
    >
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>
          You need to enable JavaScript to run this app. If you are using a
          browser extension to block JavaScript, please disable it for this
          site.
        </noscript>
        <Outlet />
        {/* This uses sessionStorage, but we deem them necessary to make navigation work as expected */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root({ loaderData: { lang } }: Route.ComponentProps) {
  useChangeLanguage(lang);
  return <Outlet />;
}

export function ErrorBoundary({ error, loaderData }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  const message = t('errors.default.title');
  let details = t('errors.default.details');
  let stack: string | undefined;

  if (!loaderData) {
    return <Error404 />;
  }

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Error404 />;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main id='main'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
