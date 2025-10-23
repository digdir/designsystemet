import { join } from 'node:path';
import { ContentContainer } from '@internal/components';
import { Outlet } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import {
  getFileFromContentDir,
  getFoldersInContentDir,
} from '~/_utils/files.server';
import { generateFromMdx } from '~/_utils/generate-from-mdx';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

export const loader = async ({
  params: { lang },
  request,
}: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  /* read all folders in content/components */
  const folders = await getFoldersInContentDir('/components');
  const cats: {
    [key: string]: {
      title: string;
      url: string;
    }[];
  } = {
    components: [],
  };

  await Promise.all(
    folders.map(async (folder) => {
      /* read overview.mdx file in lang folder */
      const mdxSource = getFileFromContentDir(
        join('components', folder, lang, 'overview.mdx'),
      );

      const result = await generateFromMdx(mdxSource);

      cats.components.push({
        title: result.frontmatter.title || folder,
        url: `/${lang}/components/${folder}`,
      });
    }),
  );

  /* sort cats by title */
  cats.components.sort((a, b) => a.title.localeCompare(b.title));

  const isOverviewPage =
    request.url.endsWith('/overview') || request.url.endsWith('/overview/');

  return {
    lang,
    cats,
    sidebarSuffix: isOverviewPage ? '/overview' : '/code',
  };
};

export default function Layout({
  loaderData: { cats, sidebarSuffix },
}: Route.ComponentProps) {
  return (
    <ContentContainer
      className={classes['sidebar-container']}
      data-color='neutral'
    >
      <Sidebar
        cats={cats}
        title={'components'}
        className={classes.sidebar}
        suffix={sidebarSuffix}
        hideCatTitle
      />
      <div className={classes.content}>
        <Outlet />
      </div>
    </ContentContainer>
  );
}
