import { join } from 'node:path';
import { ContentContainer } from '@internal/components';
import { LayersIcon } from '@navikt/aksel-icons';
import { bundleMDX } from 'mdx-bundler';
import { useTranslation } from 'react-i18next';
import { Outlet, useMatches } from 'react-router';
import {
  Banner,
  BannerHeading,
  BannerIcon,
  BannerIngress,
} from '~/_components/banner/banner';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { getFileFromContentDir, getFilesFromContentDir } from '~/_utils/files';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  /* get all patterns content */
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  /* Get all files in /content/patterns for the lang we have selected */
  const files = getFilesFromContentDir(join('patterns', lang));

  /* Filter out files that are not .mdx */
  const mdxFiles = files.filter((file) => file.relativePath.endsWith('.mdx'));

  /* Get titles and URLs for all files */
  const cats: {
    [key: string]: {
      title: string;
      url: string;
    }[];
  } = {};

  if (lang === 'no') {
    cats.Ferdig = [];
    cats['Under arbeid'] = [];
    cats.Kommende = [];
  }

  if (lang === 'en') {
    cats.Completed = [];
    cats['Under construction'] = [];
    cats.Coming = [];
  }

  /* Map over files with mdx parser to get title */
  for (const file of mdxFiles) {
    const fileContent = getFileFromContentDir(
      join('patterns', lang, file.relativePath),
    );
    const result = await bundleMDX({
      source: fileContent,
    });

    const title =
      result.frontmatter.title || file.relativePath.replace('.mdx', '');
    const url = `/${lang}/patterns/${file.relativePath.replace('.mdx', '')}`;

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
  const { t } = useTranslation();

  /* if we have id patterns-page, hide banner */
  const isPatternsPage = matches.some((match) => match.id === 'patterns-page');

  return (
    <>
      {!isPatternsPage ? (
        <Banner color='yellow'>
          <BannerIcon>
            <LayersIcon />
          </BannerIcon>
          <BannerHeading level={1}>{t('patterns.title')}</BannerHeading>
          <BannerIngress>{t('patterns.description')}</BannerIngress>
        </Banner>
      ) : null}
      <ContentContainer data-is-main={!isPatternsPage}>
        <div className={classes['sidebar-container']} data-color='neutral'>
          <Sidebar
            cats={cats}
            title={t('patterns.title')}
            className={classes.sidebar}
          />
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </ContentContainer>
    </>
  );
}
