import { data } from 'react-router';
import { getFileFromContentDir } from '~/_utils/files.server';
import type { Route } from './+types/cli-schema';

export const loader = async ({ params: { version } }: Route.LoaderArgs) => {
  /* get JSON schema from /content/schemas/cli/{VERSION} */
  const file = getFileFromContentDir(`schemas/cli/${version}`);

  return data(JSON.parse(file), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200,
  });
};
