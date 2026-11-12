import { SkipLink } from '@digdir/designsystemet-react';
import { ContentContainer } from '@internal/components';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Outlet } from 'react-router';
import type { Route } from './+types/layout';

export default function RootLayout() {
  const { t } = useTranslation();
  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  const message = t('errors.default.title');
  let details = t('errors.default.details');
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return '<Error404 />';
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <main id='main'>
        <ContentContainer>
          <h1>{message}</h1>
          <p>{details}</p>
          {stack && (
            <pre>
              <code>{stack}</code>
            </pre>
          )}
        </ContentContainer>
      </main>
    </>
  );
}
