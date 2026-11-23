import { SkipLink } from '@digdir/designsystemet-react';
import {
  ContentContainer,
  Error404,
  Figma,
  Footer,
  type FooterLinkListItemProps,
  Github,
  Header,
  Slack,
} from '@internal/components';
import { EnvelopeClosedIcon } from '@navikt/aksel-icons';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Outlet, useParams } from 'react-router';
import type { Route } from './+types/layout';

/** `Header` and `Footer` take their texts as translation keys, which they type as `TemplateStringsArray` */
const key = (text: string | string[]) =>
  text as unknown as TemplateStringsArray;

const site = 'https://designsystemet.no';

const menu = (lang: string) => [
  { name: key('navigation.intro'), href: `${site}/${lang}/intro` },
  {
    name: key('navigation.fundamentals'),
    href: `${site}/${lang}/fundamentals`,
  },
  { name: key('navigation.components'), href: `${site}/${lang}/components` },
  { name: key('navigation.patterns'), href: `${site}/${lang}/patterns` },
  {
    name: key('navigation.best-practices'),
    href: `${site}/${lang}/best-practices`,
  },
  { name: key('navigation.blog'), href: `${site}/${lang}/blog` },
  { name: key('navigation.theme-builder'), href: `/${lang}` },
];

const centerLinks = (lang: string): FooterLinkListItemProps[] => [
  {
    text: key('footer.about'),
    url: `${site}/${lang}/intro/about-the-design-system`,
  },
  { text: key('footer.privacy'), url: `${site}/${lang}/intro/privacy-policy` },
  {
    text: key('footer.accessibility'),
    url: 'https://uustatus.no/nb/erklaringer/publisert/faeb324d-9b3f-40b0-b715-92cac356a916',
  },
];

const rightLinks: FooterLinkListItemProps[] = [
  {
    text: key('designsystem@digdir.no'),
    url: 'mailto:designsystem@digdir.no',
    prefix: (
      <EnvelopeClosedIcon aria-hidden='true' height='1.5em' width='1.5em' />
    ),
  },
  {
    text: key(['footer.slack']),
    url: `${site}/slack`,
    prefix: <Slack />,
  },
  {
    text: key('Github'),
    url: 'https://github.com/digdir/designsystemet',
    prefix: <Github />,
  },
  {
    text: key('Figma'),
    url: 'https://www.figma.com/@designsystemet',
    prefix: <Figma />,
  },
];

/** The header and footer every page has, also the error page */
const Shell = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { lang = 'no' } = useParams();

  return (
    <>
      <SkipLink href='#main'>{t('accessibility.skip-link')}</SkipLink>
      <Header menu={menu(lang)} logoLink={`${site}/${lang}`} themeSwitcher />
      {children}
      <Footer centerLinks={centerLinks(lang)} rightLinks={rightLinks} />
    </>
  );
};

export default function RootLayout() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const isDevError =
    import.meta.env.DEV &&
    !isRouteErrorResponse(error) &&
    error instanceof Error;

  return (
    <Shell>
      <main id='main'>
        <ContentContainer>
          {isNotFound ? (
            <Error404 />
          ) : (
            <>
              <h1>{t('errors.default.title')}</h1>
              <p>{isDevError ? error.message : t('errors.default.details')}</p>
              {isDevError && error.stack && (
                <pre>
                  <code>{error.stack}</code>
                </pre>
              )}
            </>
          )}
        </ContentContainer>
      </main>
    </Shell>
  );
}
