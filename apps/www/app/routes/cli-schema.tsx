import { redirect } from 'react-router';
import type { Route } from './+types/cli-schema';

export const loader = ({ params: { version } }: Route.LoaderArgs) => {
  /* the schema moved to /schemas/config/{VERSION} */
  return redirect(`/schemas/config/${version}`, {
    status: 301,
  });
};
