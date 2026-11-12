import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import '@internal/digdir/themes/digdir.css';
import '@digdir/designsystemet-css';
import './app.css';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from '~/_hooks/use-change-language';

// Convension from React router
export const links: Route.LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://altinncdn.no/fonts/inter/v4.1/inter-latin.css',
    crossOrigin: 'anonymous',
    integrity:
      'sha384-dMo4FR/05iqPHBhxdybPejGKOwjCpktk6XnfJDAOP4AyMh7JFC7cCWsnOKLv7tJF',
  },
];

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { lang } = params;

  if (lang === undefined) return redirect(`/no${url.search}`);
  if (lang === 'themebuilder') return redirect(`/no${url.search}`); // Redirect from old path to new path, with search params
  if (lang !== 'no' && lang !== 'en') return redirect('/no');
  if (url.pathname.match('/.*/$')) {
    url.pathname = url.pathname.replace(/\/+$/, ''); // do this to make sure we keep params
    return redirect(url.toString());
  }

  return data({ lang });
};

function Document({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <html lang={lang} dir={i18n.dir(lang)} data-color-scheme='auto'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='text-scale' content='scale' />
        <Links />
        <Meta />
        {process.env.NODE_ENV === 'development' && (
          <script
            crossOrigin='anonymous'
            src='//unpkg.com/react-scan/dist/auto.global.js'
          />
        )}
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
      <main>
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && <pre>{stack}</pre>}
      </main>
    </Document>
  );
}
