import { redirect } from 'react-router';
import { findRedirect, REDIRECT_PARAM } from './redirects';

const ONE_DAY = 60 * 60 * 24;

export const designsystemetRedirects = (pathname: string) => {
  const match = findRedirect(pathname);
  if (!match) return null;

  const [path, hash] = match.to.split('#');
  const search = new URLSearchParams({ [REDIRECT_PARAM]: match.from });
  const secondsLeft = Math.floor(
    (new Date(match.expires).getTime() - Date.now()) / 1000,
  );

  return redirect(`${path}?${search}${hash ? `#${hash}` : ''}`, {
    status: 301,
    headers: {
      /* Browsers cache a 301 indefinitely by default, which would keep the redirect alive past its expiry */
      'Cache-Control': `max-age=${Math.min(ONE_DAY, secondsLeft)}`,
    },
  });
};
