import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  type ShouldRevalidateFunctionArgs,
} from 'react-router';

import type { Route } from './+types/root';
import '@internal/digdir/themes/digdir.css';
import '@digdir/designsystemet-css';
import './app.css';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from '~/_hooks/use-change-language';

export const links: Route.LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: 'https://altinncdn.no/fonts/inter/v4.1/inter-latin.css',
      integrity:
        'sha384-dMo4FR/05iqPHBhxdybPejGKOwjCpktk6XnfJDAOP4AyMh7JFC7cCWsnOKLv7tJF',
      crossOrigin: 'anonymous',
    },
  ];
};

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const lang = params.lang;

  /* No language, or the old path `/themebuilder`: go to Norwegian, with search params */
  if (lang === undefined || lang === 'themebuilder') {
    return redirect(`/no${url.search}`);
  }

  if (lang !== 'no' && lang !== 'en') {
    return redirect('/no');
  }

  if (url.pathname.match('/.*/$')) {
    /* do this to make sure we keep params */
    url.pathname = url.pathname.replace(/\/+$/, '');
    return redirect(url.toString());
  }

  return { lang };
};

/* The loader only depends on the path. Left to run for every change of the URL, it would run when the view tab or
 * the appearance is changed, and a second change made while it runs would start from the old URL and undo the first. */
export const shouldRevalidate = ({
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) => currentUrl.pathname !== nextUrl.pathname;

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
        {stack && (
          <pre>
            <code>{stack}</code>
          </pre>
        )}
      </main>
    </Document>
  );
}
