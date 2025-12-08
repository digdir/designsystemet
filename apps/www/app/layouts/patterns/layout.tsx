import { join } from 'node:path';
import { bundleMDX } from 'mdx-bundler';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import {
  getFileFromContentDir,
  getFilesFromContentDir,
} from '~/_utils/files.server';
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
      partners: string;
      order: number;
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
      partners: result.frontmatter.partners || '',
      order: result.frontmatter.order || 10,
    });
  }

  for (const cat in cats) {
    cats[cat].sort((a, b) => {
      return a.order - b.order;
    });
  }

  return { lang, cats };
};

export default function Layout({ loaderData: { cats } }: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <div className={'l-content-container'}>
      <Sidebar cats={cats} title={t('patterns.title')} hideCatTitle />
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
}
