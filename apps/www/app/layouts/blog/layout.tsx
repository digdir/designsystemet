import { PencilIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Outlet, isRouteErrorResponse } from 'react-router';
import { Banner, BannerHeading, BannerIcon } from '~/_components/banner/banner';
import { ContentContainer } from '~/_components/content-container/content-container';
import { Error404 } from '~/_components/errors/error-404';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div>
      <Banner color='red'>
        <BannerIcon>
          <PencilIcon />
        </BannerIcon>
        <BannerHeading level={1}>{t('blog.title')}</BannerHeading>
      </Banner>
      <ContentContainer className={classes.main}>
        <Outlet />
      </ContentContainer>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  const message = t('errors.default.title');
  let details = t('errors.default.details');
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
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
