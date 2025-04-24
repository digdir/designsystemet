import { join } from 'node:path';
import { HandShakeHeartIcon } from '@navikt/aksel-icons';
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

  const mdxFiles = getFilesFromContentDir(join('god-praksis', lang));

  const cats: {
    [key: string]: {
      title: string;
      url: string;
      description: string;
      author: string;
      date: string;
    }[];
  } = {
    Brukerinnsikt: [],
    Tilgjengelighet: [],
    Innholdsarbeid: [],
  };

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('god-praksis', lang, file.relativePath),
    );
    const result = await generateFromMdx(fileContent);

    const title =
      result.frontmatter.title || file.relativePath.replace('.mdx', '');
    const url = `/${lang}/god-praksis/${file.relativePath.replace('.mdx', '')}`;
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

  return {
    lang,
    cats,
    descriptions: {
      Brukerinnsikt: 'Designressurser og kunnskapsdeling rundt brukerinnsikt.',
      Tilgjengelighet:
        'Tilgjengelighet og universell utforming handler om at det vi lager skal kunne brukes av alle uavhengig av funksjonsevne eller brukskontekst.',
      Innholdsarbeid:
        'Brukerne skal finne, forstå og gjøre det de kom til tjenesten for å gjøre. Derfor er det viktig at vi skriver brukertilpasset, klart og tydelig.',
    },
  };
};

export default function Layout({ loaderData: { cats } }: Route.ComponentProps) {
  const matches = useMatches();

  /* if we have id god-praksis-page, hide banner */
  const isGodPraksisPage = matches.some(
    (match) => match.id === 'god-praksis-page',
  );

  return (
    <>
      {!isGodPraksisPage ? (
        <>
          <Banner color='yellow'>
            <BannerIcon>
              <HandShakeHeartIcon />
            </BannerIcon>
            <BannerHeading level={1}>God praksis</BannerHeading>
            <BannerIngress>
              Her deler vi god praksis med hverandre. Råd og veiledning som kan
              bidra til å lage bedre helhetlige tjenester samles her.
            </BannerIngress>
          </Banner>
        </>
      ) : null}
      {!isGodPraksisPage ? (
        <div className={classes.content}>
          <div className={classes.container}>
            <Outlet />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
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
