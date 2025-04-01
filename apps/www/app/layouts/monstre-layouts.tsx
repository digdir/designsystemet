import { Breadcrumbs } from '@digdir/designsystemet-react';
import { Link, Outlet } from 'react-router';

export default function MonstreLayout() {
  return (
    <div className='text-center p-4'>
      <Breadcrumbs>
        <Breadcrumbs.Link asChild>
          <Link to='/'>Gå heim</Link>
        </Breadcrumbs.Link>
      </Breadcrumbs>
      <h2 className='text-2xl'>Monstre Layout</h2>

      <Outlet />
    </div>
  );
}
