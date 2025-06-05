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
import { Error404 } from '@internal/rr-components';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import { designsystemetRedirects } from './_utils/redirects.server';

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

  const hasRedirect = designsystemetRedirects(url.pathname);

  const lang = params.lang;

  if (!hasRedirect) {
    const trimmed =
      url.pathname.charAt(url.pathname.length - 1) === '/'
        ? url.pathname.slice(0, -1)
        : url.pathname;
    if (lang !== 'no' && lang !== 'en' && trimmed.split('/').length === 2) {
      return redirect('/no');
    }
  } else {
    return hasRedirect;
  }

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

  return data({
    lang: params.lang || 'no',
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

export default function App({ loaderData: { lang } }: Route.ComponentProps) {
  useChangeLanguage(lang);

  return (
    <Document>
      <Outlet />
    </Document>
  );
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
    <Document>
      <main id='main'>
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre>
            <code>{stack}</code>
          </pre>
        )}
      </main>
    </Document>
  );
}
