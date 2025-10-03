import { ContentContainer } from '@internal/components';
import { Outlet } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { getFoldersInContentDir } from '~/_utils/files.server';
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

  folders.forEach((folder) => {
    cats.components.push({
      title: folder,
      url: `/${lang}/components/${folder}`,
    });
  });

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
