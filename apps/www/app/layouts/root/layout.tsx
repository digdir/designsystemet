import { SkipLink } from '@digdir/designsystemet-react';
import type { FooterLinkListItemProps } from '@internal/components';
import {
  ContentContainer,
  Error404,
  Footer,
  Header,
} from '@internal/components';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import {
  isRouteErrorResponse,
  Outlet,
  useFetcher,
  useRouteLoaderData,
} from 'react-router';
import { useChangeLanguage } from 'remix-i18next/react';
import { Figma } from '~/_components/logos/figma';
import { Github } from '~/_components/logos/github';
import { Slack } from '~/_components/logos/slack';
import i18n from '~/i18n';
import type { Route as RootRoute } from './../../+types/root';
import type { Route } from './+types/layout';
import type { action as searchAction } from '~/routes/api/search';
import type { action as aiSearchAction } from '~/routes/api/ai-search';

export const loader = ({ params }: Route.LoaderArgs) => {
  if (!i18n.supportedLngs.includes(params.lang || '')) {
    throw new Response('Not Found', {
      status: 404,
    });
  }
};

const rightLinks: FooterLinkListItemProps[] = [
  {
    text: 'designsystem@digdir.no' as unknown as FooterLinkListItemProps['text'],
    url: 'mailto:designsystem@digdir.no',
    prefix: <EnvelopeClosedIcon aria-hidden='true' fontSize='1.5em' />,
  },
  {
    text: ['footer.slack'] as unknown as FooterLinkListItemProps['text'],
    url: '/slack',
    prefix: <Slack aria-hidden='true' />,
  },
  {
    text: 'Github' as unknown as FooterLinkListItemProps['text'],
    url: 'https://github.com/digdir/designsystemet',
    prefix: <Github aria-hidden='true' />,
  },
  {
    text: 'Figma' as unknown as FooterLinkListItemProps['text'],
    url: 'https://www.figma.com/@designsystemet',
    prefix: <Figma aria-hidden='true' />,
  },
];

export default function RootLayout() {
  const { t } = useTranslation();
  const searchFetcher = useFetcher<typeof searchAction>();
  const aiSearchFetcher = useFetcher<typeof aiSearchAction>();
  const { lang, centerLinks, menu } = useRouteLoaderData('root') as Omit<
    RootRoute.ComponentProps['loaderData'],
    'centerLinks'
  > & {
    centerLinks: FooterLinkListItemProps[];
    menu: {
      name: TemplateStringsArray;
      href: string;
    }[];
  };

  useChangeLanguage(lang);

  const handleSearch = (query: string) => {
    searchFetcher.submit({ query }, { method: 'post', action: '/api/search' });
  };

  const handleAiSearch = (query: string) => {
    aiSearchFetcher.submit(
      { query },
      { method: 'post', action: '/api/ai-search' },
    );
  };

  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header
        menu={menu}
        logoLink={`/${lang === 'no' ? 'no' : lang === 'en' ? 'en' : 'no'}`}
        themeSwitcher
        onSearch={handleSearch}
        onAiSearch={handleAiSearch}
        isSearching={searchFetcher.state === 'submitting'}
        isAiSearching={aiSearchFetcher.state === 'submitting'}
        searchResult={searchFetcher.data}
        aiSearchResult={aiSearchFetcher.data}
      />
      <main id='main'>
        <Outlet />
      </main>
      <Footer
        centerLinks={centerLinks}
        rightLinks={rightLinks as FooterLinkListItemProps[]}
      />
    </>
  );
}

type ErrorWrapperRootProps = {
  children: React.ReactNode;
  lang: string;
  menu: {
    name: TemplateStringsArray;
    href: string;
  }[];
  centerLinks: {
    text: TemplateStringsArray;
    url: string;
  }[];
  rightLinks: {
    text: TemplateStringsArray;
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
  const searchFetcher = useFetcher<typeof searchAction>();
  const aiSearchFetcher = useFetcher<typeof aiSearchAction>();

  const handleSearch = (query: string) => {
    searchFetcher.submit({ query }, { method: 'post', action: '/api/search' });
  };

  const handleAiSearch = (query: string) => {
    aiSearchFetcher.submit(
      { query },
      { method: 'post', action: '/api/ai-search' },
    );
  };

  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header
        menu={menu}
        logoLink={`/${lang === 'no' ? 'no' : lang === 'en' ? 'en' : 'no'}`}
        themeSwitcher
        onSearch={handleSearch}
        onAiSearch={handleAiSearch}
        isSearching={searchFetcher.state === 'submitting'}
        isAiSearching={aiSearchFetcher.state === 'submitting'}
        searchResult={searchFetcher.data}
        aiSearchResult={aiSearchFetcher.data}
      />
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
  ) as RootRoute.ComponentProps['loaderData'] & {
    centerLinks: FooterLinkListItemProps[];
    menu: {
      name: TemplateStringsArray;
      href: string;
    }[];
  };

  if (!loaderData) {
    return <Error404 />;
  }

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <ErrorWrapperRoot
          lang={loaderData.lang}
          menu={loaderData.menu}
          centerLinks={loaderData.centerLinks}
          rightLinks={[]}
        >
          <Error404 />
        </ErrorWrapperRoot>
      );
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
