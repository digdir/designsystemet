import { useTranslation } from 'react-i18next';
import { Outlet, isRouteErrorResponse } from 'react-router';
import { ContentContainer } from '~/_components/content-container/content-container';
import { Error404 } from '~/_components/errors/error-404';
import type { Route } from './+types/layout';

export default function MonstreLayout() {
  return (
    <ContentContainer>
      <Outlet />
    </ContentContainer>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  let message = t('errors.default.title');
  let details = t('errors.default.details');
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message =
      error.status === 404 ? t('errors.404.title') : t('errors.generic.title');
    details =
      error.status === 404
        ? t('errors.404.details')
        : error.statusText || details;

    if (error.status === 404) {
      return <Error404 />;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <ContentContainer>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </ContentContainer>
  );
}
