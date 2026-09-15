import { redirect } from 'react-router';
import type { Route } from './+types/redirect-themebuilder';

export const loader = ({ params: { lang }, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);

  return redirect(`/${lang}${url.search}`);
};
