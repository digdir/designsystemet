import { SkipLink } from '@digdir/designsystemet-react';
import { Outlet } from 'react-router';
import { Header } from '~/_components/header/header';
import type { Route } from './+types/layout';

export const loader = ({ params: { lang } }: Route.LoaderArgs) => {
  return {
    lang,
  };
};

export default function RootLayout({
  loaderData: { lang },
}: Route.ComponentProps) {
  const menu = [
    {
      name: 'Mønstre',
      href: `/${lang}/monstre`,
    },
  ];
  return (
    <>
      <SkipLink href='#main'>Hopp til hovedinnhold</SkipLink>
      <Header menu={menu} logoLink={`/${lang}`} />
      <main id='main'>
        <Outlet />
      </main>
    </>
  );
}
