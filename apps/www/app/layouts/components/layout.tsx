import { ContentContainer } from '@internal/components';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { Sidebar } from '~/_components/sidebar/sidebar';
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

  return {
    lang,
  };
};

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();

  return (
    <ContentContainer
      className={classes['sidebar-container']}
      data-color='neutral'
    >
      <Sidebar cats={{}} title={'components'} className={classes.sidebar} />
      <div className={classes.content}>
        <Outlet />
      </div>
    </ContentContainer>
  );
}
