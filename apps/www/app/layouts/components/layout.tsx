import { ContentContainer } from '@internal/components';
import { Outlet } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
import { getFoldersInContentDir } from '~/_utils/files.server';
import type { Route } from './+types/layout';
import classes from './layout.module.css';

export { ErrorBoundary } from '~/root';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
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

  return {
    lang,
    cats,
  };
};

export default function Layout({ loaderData: { cats } }: Route.ComponentProps) {
  return (
    <ContentContainer
      className={classes['sidebar-container']}
      data-color='neutral'
    >
      <Sidebar
        cats={cats}
        title={'components'}
        className={classes.sidebar}
        hideCatTitle
      />
      <div className={classes.content}>
        <Outlet />
      </div>
    </ContentContainer>
  );
}
