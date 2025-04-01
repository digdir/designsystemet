import { SkipLink } from '@digdir/designsystemet-react';
import { Digdir } from '@repo/components/src/logos/Digdir';
import { Link, Outlet } from 'react-router';
import styles from './root-layout.module.css';

export default function RootLayout() {
  return (
    <>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <header className={styles.header}>
        <Link to='/'>
          <Digdir />
        </Link>
      </header>
      <main id='main'>
        <Outlet />
      </main>
    </>
  );
}
