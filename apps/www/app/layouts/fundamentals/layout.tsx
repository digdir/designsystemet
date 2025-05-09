import { join } from 'node:path';
import { LayersIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Outlet, isRouteErrorResponse, useMatches } from 'react-router';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '~/_components/banner/banner';
import { ContentContainer } from '~/_components/content-container/content-container';
import { Error404 } from '~/_components/errors/error-404';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { getFileFromContentDir, getFilesFromContentDir } from '~/_utils/files';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const mdxFiles = getFilesFromContentDir(join('fundamentals', lang));

  const cats: {
    [key: string]: {
      title: string;
      url: string;
      icon: string;
      color: 'red' | 'blue' | 'yellow';
      description: string;
    }[];
  } = {};

  if (lang === 'no') {
    cats.Introduksjon = [];
    cats.Designelementer = [];
    cats['For designere'] = [];
    cats['For utviklere'] = [];
  }

  if (lang === 'en') {
    cats.Introduction = [];
    cats['Design elements'] = [];
    cats['For designers'] = [];
    cats['For developers'] = [];
  }

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('fundamentals', lang, file.relativePath),
    );
    const result = await generateFromMdx(fileContent);

    if (!result.frontmatter.published) {
      continue;
    }

    const title =
      result.frontmatter.title || file.relativePath.replace('.mdx', '');
    const url =
      `/${lang}/fundamentals/${file.relativePath.replace('.mdx', '')}`.replace(
        '\\',
        '/',
      );

    if (!result.frontmatter.category) {
      continue;
    }

    if (!cats[result.frontmatter.category]) {
      cats[result.frontmatter.category] = [];
    }

    cats[result.frontmatter.category].push({
      title: result.frontmatter.sidebar_title || title,
      url,
      icon: result.frontmatter.icon,
      color: result.frontmatter.color || 'red',
      description: result.frontmatter.description || '',
    });
  }

  return {
    lang,
    cats,
    descriptions: {
      Introduksjon:
        'Designsystemet inneholder grunnleggende designelementer, mønstre, god praksis og kodede komponenter som gir verdi å dele på tvers av offentlig sektor.',
      Designelementer:
        'Stilene i designsystemet er grunnleggende designelementer som brukes i komponentene. De finnes i flere sett for ulike identiteter og ulike behov og situasjoner. For eksempel har vi et eget sett for kompakt visning, som kan være hensiktsmessig å bruke i verktøy eller admingrensesnitt.',
      'For designere': 'Ressurser og veiledning relevant for designere',
      'For utviklere': 'Ressurser og veiledning relevant for utviklere',
    },
  };
};

export default function Layout({ loaderData: { cats } }: Route.ComponentProps) {
  const matches = useMatches();
  const { t } = useTranslation();

  /* if we have id fundamentals-page, hide banner */
  const isGrunnleggendePage = matches.some(
    (match) => match.id === 'fundamentals-page',
  );

  return (
    <>
      {!isGrunnleggendePage ? (
        <Banner color='yellow'>
          <BannerIcon>
            <LayersIcon />
          </BannerIcon>
          <BannerHeading level={1}>{t('fundamentals.title')}</BannerHeading>
          <BannerIngress>{t('fundamentals.description')}</BannerIngress>
        </Banner>
      ) : null}
      <ContentContainer
        className={classes['sidebar-container']}
        data-color='neutral'
      >
        <Sidebar
          cats={cats}
          title={t('fundamentals.title')}
          className={classes.sidebar}
        />
        <div className={classes.content}>
          <Outlet />
        </div>
      </ContentContainer>
    </>
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
