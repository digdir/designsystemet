import { SkipLink } from '@digdir/designsystemet-react';
import type { FooterLinkListItemProps } from '@internal/components';
import {
  ContentContainer,
  Error404,
  Footer,
  Header,
} from '@internal/components';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import { useCallback, useEffect, useRef } from 'react';
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
import type { action as aiSearchAction } from '~/routes/api/ai-search';
import type { action as searchAction } from '~/routes/api/search';
import type { Route as RootRoute } from './../../+types/root';
import type { Route } from './+types/layout';

export const loader = ({ params }: Route.LoaderArgs) => {
  if (!i18n.supportedLngs.includes(params.lang || '')) {
    throw new Response('Not Found', {
      status: 404,
    });
  }
};

type QuickResult = {
  title: string;
  content: string;
  url: string;
  type: 'component' | 'guide' | 'pattern' | 'blog';
  sources?: { title: string; url: string }[];
};

type PendingRequest = {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timeout: NodeJS.Timeout;
};

type SearchPromiseReturn = {
  success: boolean;
  results: QuickResult[];
  query: string;
  error?: string;
};

type SearchPromise = (query: string) => Promise<SearchPromiseReturn>;

type AiSearchPromiseReturn = {
  success: boolean;
  result: {
    content: string;
    sources: { title: string; url: string }[];
  };
  query: string;
  error?: string;
};

type AiSearchPromise = (query: string) => Promise<AiSearchPromiseReturn>;

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

  // MARK: Search handling
  const searchFetcher = useFetcher<typeof searchAction>();
  const aiSearchFetcher = useFetcher<typeof aiSearchAction>();
  const pendingSearchRef = useRef<PendingRequest | null>(null);
  const pendingAiSearchRef = useRef<PendingRequest | null>(null);

  useEffect(() => {
    if (searchFetcher.state === 'idle' && pendingSearchRef.current) {
      clearTimeout(pendingSearchRef.current.timeout);

      if (searchFetcher.data) {
        pendingSearchRef.current.resolve(searchFetcher.data);
      } else {
        pendingSearchRef.current.reject(
          new Error('Search request failed or returned no data.'),
        );
      }
      pendingSearchRef.current = null;
    }
  }, [searchFetcher.state, searchFetcher.data]);

  useEffect(() => {
    if (aiSearchFetcher.state === 'idle' && pendingAiSearchRef.current) {
      clearTimeout(pendingAiSearchRef.current.timeout);

      if (aiSearchFetcher.data) {
        pendingAiSearchRef.current.resolve(aiSearchFetcher.data);
      } else {
        pendingAiSearchRef.current.reject(
          new Error('AI search request failed or returned no data.'),
        );
      }
      pendingAiSearchRef.current = null;
    }
  }, [aiSearchFetcher.state, aiSearchFetcher.data]);

  const handleSearch: SearchPromise = useCallback(
    (query: string) => {
      if (pendingSearchRef.current) {
        clearTimeout(pendingSearchRef.current.timeout);
        pendingSearchRef.current.reject(new Error('Request cancelled'));
        pendingSearchRef.current = null;
      }

      const promise = new Promise<SearchPromiseReturn>((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (pendingSearchRef.current) {
            pendingSearchRef.current = null;
            reject(new Error('Search request timed out'));
          }
        }, 30000);

        pendingSearchRef.current = { resolve, reject, timeout };

        searchFetcher.submit(
          { query },
          { method: 'post', action: '/api/search' },
        );
      });

      return promise;
    },
    [searchFetcher],
  );

  const handleAiSearch: AiSearchPromise = useCallback(
    (query: string) => {
      if (pendingAiSearchRef.current) {
        clearTimeout(pendingAiSearchRef.current.timeout);
        pendingAiSearchRef.current.reject(new Error('Request cancelled'));
        pendingAiSearchRef.current = null;
      }

      const promise = new Promise<AiSearchPromiseReturn>((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (pendingAiSearchRef.current) {
            pendingAiSearchRef.current = null;
            reject(new Error('AI search request timed out'));
          }
        }, 30000);

        pendingAiSearchRef.current = { resolve, reject, timeout };

        aiSearchFetcher.submit(
          { query },
          { method: 'post', action: '/api/ai-search' },
        );
      });

      return promise;
    },
    [aiSearchFetcher],
  );

  useEffect(() => {
    return () => {
      if (pendingSearchRef.current) {
        clearTimeout(pendingSearchRef.current.timeout);
        pendingSearchRef.current.reject(new Error('Component unmounted'));
        pendingSearchRef.current = null;
      }
      if (pendingAiSearchRef.current) {
        clearTimeout(pendingAiSearchRef.current.timeout);
        pendingAiSearchRef.current.reject(new Error('Component unmounted'));
        pendingAiSearchRef.current = null;
      }
    };
  }, []);
  // MARK: End search handling

  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header
        menu={menu}
        logoLink={`/${lang === 'no' ? 'no' : lang === 'en' ? 'en' : 'no'}`}
        themeSwitcher
        onSearch={handleSearch}
        onAiSearch={handleAiSearch}
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

  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header
        menu={menu}
        logoLink={`/${lang === 'no' ? 'no' : lang === 'en' ? 'en' : 'no'}`}
        themeSwitcher
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
