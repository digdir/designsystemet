import { Breadcrumbs } from '@digdir/designsystemet-react';
import { Link, Outlet } from 'react-router';
import { ContentContainer } from '~/_components/content-container/content-container';
import type { Route } from './+types/page';

export const loader = ({ params: { lang } }: Route.LoaderArgs) => {
  return {
    lang,
  };
};

export default function MonstreLayout({ loaderData }: Route.ComponentProps) {
  return (
    <ContentContainer>
      <Breadcrumbs>
        <Breadcrumbs.Link asChild>
          <Link to={`/${loaderData.lang}`}>Gå heim</Link>
        </Breadcrumbs.Link>
      </Breadcrumbs>

      <Outlet />
    </ContentContainer>
  );
}
