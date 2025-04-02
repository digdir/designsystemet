import { Breadcrumbs } from '@digdir/designsystemet-react';
import { Link, Outlet } from 'react-router';
import type { Route } from './+types/monstre-layouts';

export const loader = ({ params: { lang } }: Route.LoaderArgs) => {
  return {
    lang,
  };
};

export default function MonstreLayout({ loaderData }: Route.ComponentProps) {
  return (
    <div className='text-center p-4'>
      <Breadcrumbs>
        <Breadcrumbs.Link asChild>
          <Link to={`/${loaderData.lang}`}>Gå heim</Link>
        </Breadcrumbs.Link>
      </Breadcrumbs>
      <h2 className='text-2xl'>Monstre Layout</h2>

      <Outlet />
    </div>
  );
}
