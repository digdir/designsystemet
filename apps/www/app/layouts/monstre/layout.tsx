import { join } from 'node:path';
import { LayersIcon } from '@navikt/aksel-icons';
import { bundleMDX } from 'mdx-bundler';
import { Outlet, isRouteErrorResponse, useMatches } from 'react-router';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '~/_components/banner/banner';
import { ContentContainer } from '~/_components/content-container/content-container';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { getFileFromContentDir, getFilesFromContentDir } from '~/_utils/files';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  /* get all monstre content */
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  /* Get all files in /content/monstre for the lang we have selected */
  const files = getFilesFromContentDir(join('monstre', lang));

  /* Filter out files that are not .mdx */
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'));

  /* Get titles and URLs for all files */
  const cats: {
    [key: string]: {
      title: string;
      url: string;
    }[];
  } = {
    Ferdig: [],
    'Under arbeid': [],
    Kommende: [],
  };

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(join('monstre', lang, `${file}`));
    const result = await bundleMDX({
      source: fileContent,
    });

    const title = result.frontmatter.title || file.replace('.mdx', '');
    const url = `/${lang}/monstre/${file.replace('.mdx', '')}`;

    if (!result.frontmatter.category) {
      continue;
    }

    if (!cats[result.frontmatter.category]) {
      cats[result.frontmatter.category] = [];
    }

    cats[result.frontmatter.category].push({
      title: result.frontmatter.sidebar_title || title,
      url,
    });
  }

  return { lang, cats };
};

export default function Layout({ loaderData: { cats } }: Route.ComponentProps) {
  const matches = useMatches();

  /* if we have id monstre-page, hide banner */
  const isMonstrePage = matches.some((match) => match.id === 'monstre-page');

  return (
    <>
      {!isMonstrePage ? (
        <Banner color='yellow'>
          <BannerIcon>
            <LayersIcon />
          </BannerIcon>
          <BannerHeading level={1}>Mønstre</BannerHeading>
          <BannerIngress>
            Mønstre er retningslinjer og anbefalinger for hvordan interaksjon og
            gjentagende brukeroppgaver skal løses. Når de samme mønstrene brukes
            på tvers, skaper vi gjenkjennelighet i tjenestene.
          </BannerIngress>
        </Banner>
      ) : null}
      <ContentContainer>
        <div className={classes['sidebar-container']} data-color='neutral'>
          <Sidebar cats={cats} title='Mønstre' className={classes.sidebar} />
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </ContentContainer>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!!!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

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
