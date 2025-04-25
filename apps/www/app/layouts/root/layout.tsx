import { SkipLink } from '@digdir/designsystemet-react';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Outlet, isRouteErrorResponse, useRouteLoaderData } from 'react-router';
import { ContentContainer } from '~/_components/content-container/content-container';
import { Error404 } from '~/_components/errors/error-404';
import { Footer } from '~/_components/footer/footer';
import { Header } from '~/_components/header/header';
import { Figma } from '~/_components/logos/figma';
import { Github } from '~/_components/logos/github';
import { Slack } from '~/_components/logos/slack';
import type { Route } from './+types/layout';
import type { Route as RootRoute } from './../../+types/root';

const rightLinks = [
  {
    text: 'designsystem@digdir.no',
    url: 'mailto:designsystem@digdir.no',
    prefix: <EnvelopeClosedIcon aria-hidden='true' fontSize='1.5em' />,
  },
  {
    text: 'footer.slack',
    url: '/slack',
    prefix: <Slack />,
  },
  {
    text: 'Github',
    url: 'https://github.com/digdir/designsystemet',
    prefix: <Github />,
  },
  {
    text: 'Figma',
    url: 'https://www.figma.com/@designsystemet',
    prefix: <Figma />,
  },
];

export default function RootLayout() {
  const { t } = useTranslation();
  const { lang, centerLinks, menu } = useRouteLoaderData(
    'root',
  ) as RootRoute.ComponentProps['loaderData'];

  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header menu={menu} logoLink={`/${lang}`} themeSwitcher />
      <main id='main'>
        <Outlet />
      </main>
      <Footer centerLinks={centerLinks} rightLinks={rightLinks} />
    </>
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
  lang,
  menu,
  centerLinks,
  rightLinks,
}: ErrorWrapperRootProps) => {
  const { t } = useTranslation();

  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header menu={menu} logoLink={`/${lang}`} themeSwitcher />
      <main id='main'>
        <ContentContainer>{children}</ContentContainer>
      </main>
      <Footer centerLinks={centerLinks} rightLinks={rightLinks} />
    </>
  );
};

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  const message = t('errors.default.title');
  let details = t('errors.default.details');
  let stack: string | undefined;

  const loaderData = useRouteLoaderData(
    'root',
  ) as RootRoute.ComponentProps['loaderData'];

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
    <ErrorWrapperRoot
      lang={loaderData.lang}
      menu={loaderData.menu}
      centerLinks={loaderData.centerLinks}
      rightLinks={[]}
    >
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
