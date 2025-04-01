import { List } from '@digdir/designsystemet-react';
import { Link } from 'react-router';
import type { Route } from './+types/home';

export function loader() {
  return { name: 'React Router' };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className='text-center p-4'>
      <h1 className='text-2xl'>Designsystemet i {loaderData.name}</h1>
      <List.Unordered>
        <List.Item>
          <Link to='/monstre/ein'>Go to Monstre 1</Link>
        </List.Item>
        <List.Item>
          <Link to='/monstre/to'>Go to Monstre 2</Link>
        </List.Item>
      </List.Unordered>
    </div>
  );
}
