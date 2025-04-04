import {} from '@digdir/designsystemet-react';
import type { Route } from './+types';

export const loader = async ({ params: { lang } }: Route.LoaderArgs) => {
  if (!lang) {
    throw new Response('Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return { lang };
};

export const meta = () => {
  return [
    {
      title: 'grunnleggende',
      description: 'grunnleggende',
    },
  ];
};

export default function Monstre({ loaderData }: Route.ComponentProps) {
  return <>Grunnleggende!</>;
}
