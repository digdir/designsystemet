import { SkipLink } from '@digdir/designsystemet-react';
import { Digdir } from '@repo/components/src/logos/Digdir';
import { Link, Outlet } from 'react-router';
import type { Route } from './+types/root-layout';
import styles from './root-layout.module.css';

export const loader = ({ params: { lang } }: Route.LoaderArgs) => {
  return {
    lang,
  };
};

export default function RootLayout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <header className={styles.header}>
        <Link to={`/${loaderData.lang}`}>
          <Digdir />
        </Link>
      </header>
      <main id='main' className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
