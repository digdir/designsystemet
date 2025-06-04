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

export const links: Route.LinksFunction = () => {
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

export const loader = async ({ params }: Route.LoaderArgs) => {
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
      url: `https://designsystemet.no/${lang}/fundamentals/introduction/about-the-design-system`,
    },
    {
      text: 'footer.privacy',
      url: `https://designsystemet.no/${lang}/fundamentals/privacy-policy`,
    },
    {
      text: 'footer.accessibility',
      url: 'https://uustatus.no/nb/erklaringer/publisert/faeb324d-9b3f-40b0-b715-92cac356a916',
    },
  ];

  const menu = [
    {
      name: 'navigation.fundamentals',
      href: `https://designsystemet.no/${lang}/fundamentals`,
    },
    {
      name: 'navigation.best-practices',
      href: `https://designsystemet.no/${lang}/best-practices`,
    },
    {
      name: 'navigation.patterns',
      href: `https://designsystemet.no/${lang}/patterns`,
    },
    {
      name: 'navigation.blog',
      href: `https://designsystemet.no/${lang}/blog`,
    },
    {
      name: 'navigation.components',
      href: `https://designsystemet.no/${lang}/components`,
    },
    {
      name: 'navigation.theme-builder',
      href: `/${lang}`,
    },
  ];

  return data({
    lang: params.lang,
    centerLinks,
    menu,
  });
};

type DocumentProps = {
  children: React.ReactNode;
};

function Document({ children }: DocumentProps) {
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
        <Links />
        <Meta />
        <script
          crossOrigin='anonymous'
          src='//unpkg.com/react-scan/dist/auto.global.js'
        />
      </head>
      <body>
        <noscript>
          You need to enable JavaScript to run this app. If you are using a
          browser extension to block JavaScript, please disable it for this
          site.
        </noscript>
        {children}
        {/* This uses sessionStorage, but we deem it necessary to make navigation work as expected */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root({ loaderData: { lang } }: Route.ComponentProps) {
  useChangeLanguage(lang);
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Document>
      <main className='pt-16 p-4 container mx-auto'>
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className='w-full p-4 overflow-x-auto'>
            <code>{stack}</code>
          </pre>
        )}
      </main>
    </Document>
  );
}
