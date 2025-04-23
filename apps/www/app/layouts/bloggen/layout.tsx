import { PencilIcon } from '@navikt/aksel-icons';
import { Outlet, isRouteErrorResponse } from 'react-router';
import { Banner, BannerHeading, BannerIcon } from '~/_components/banner/banner';
import { ContentContainer } from '~/_components/content-container/content-container';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export default function Layout() {
  return (
    <div>
      <Banner color='red'>
        <BannerIcon>
          <PencilIcon />
        </BannerIcon>
        <BannerHeading level={1}>Bloggen</BannerHeading>
      </Banner>
      <ContentContainer className={classes.main}>
        <Outlet />
      </ContentContainer>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!!!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  console.log(error);

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'Vi kunne ikke finne siden du leter etter.'
        : error.statusText || details;
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
