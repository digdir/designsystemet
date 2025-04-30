import { join } from 'node:path';
import { HandShakeHeartIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { Outlet, isRouteErrorResponse, useMatches } from 'react-router';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '~/_components/banner/banner';
import { ContentContainer } from '~/_components/content-container/content-container';
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

  const mdxFiles = getFilesFromContentDir(join('best-practices', lang));

  const cats: {
    [key: string]: {
      title: string;
      url: string;
      description: string;
      author: string;
      date: string;
      published?: boolean;
    }[];
  } = {};

  if (lang === 'no') {
    cats.Brukerinnsikt = [];
    cats.Tilgjengelighet = [];
    cats.Innholdsarbeid = [];
  }

  if (lang === 'en') {
    cats['User insight'] = [];
    cats.Accessibility = [];
    cats['Content work'] = [];
  }

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('best-practices', lang, file.relativePath),
    );
    const result = await generateFromMdx(fileContent);

    if (!result.frontmatter.published) {
      continue;
    }

    const title =
      result.frontmatter.title || file.relativePath.replace('.mdx', '');
    const url = `/${lang}/best-practices/${file.relativePath.replace('.mdx', '')}`;
    const author = result.frontmatter.author || '';
    const date = result.frontmatter.date || '';

    if (!result.frontmatter.category) {
      continue;
    }

    if (!cats[result.frontmatter.category]) {
      cats[result.frontmatter.category] = [];
    }

    cats[result.frontmatter.category].push({
      title,
      url,
      author,
      date,
      description: result.frontmatter.description || '',
    });
  }
  /* Sort articles by date */
  for (const cat in cats) {
    cats[cat].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  let descriptions = {};
  if (lang === 'no') {
    descriptions = {
      Brukerinnsikt: 'Designressurser og kunnskapsdeling rundt brukerinnsikt.',
      Tilgjengelighet:
        'Tilgjengelighet og universell utforming handler om at det vi lager skal kunne brukes av alle uavhengig av funksjonsevne eller brukskontekst.',
      Innholdsarbeid:
        'Brukerne skal finne, forstå og gjøre det de kom til tjenesten for å gjøre. Derfor er det viktig at vi skriver brukertilpasset, klart og tydelig.',
    };
  }
  if (lang === 'en') {
    descriptions = {
      'User insight':
        'Design resources and knowledge sharing around user insight.',
      Accessibility:
        'Accessibility and universal design mean that what we create should be usable by everyone, regardless of functional ability or use context.',
      'Content work':
        'Users should find, understand, and do what they came to the service to do. Therefore, it is important that we write user-adapted, clear, and concise.',
    };
  }

  return {
    lang,
    cats,
    descriptions,
  };
};

export default function Layout({ loaderData: { cats } }: Route.ComponentProps) {
  const matches = useMatches();
  const { t } = useTranslation();

  /* if we have id best-practices-page, hide banner */
  const isGodPraksisPage = matches.some(
    (match) => match.id === 'best-practices-page',
  );

  return (
    <>
      {!isGodPraksisPage ? (
        <>
          <Banner color='yellow'>
            <BannerIcon>
              <HandShakeHeartIcon fontSize={34} />
            </BannerIcon>
            <BannerHeading level={1}>{t('best-practices.title')}</BannerHeading>
            <BannerIngress>{t('best-practices.description')}</BannerIngress>
          </Banner>
          <div className={classes.content}>
            <div className={classes.container}>
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useTranslation();
  let message = t('errors.default.title');
  let details = t('errors.default.details');
  let stack: string | undefined;

  console.log(error);

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? t('errors.404.details')
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
