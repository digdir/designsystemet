import { redirect } from 'react-router';

export const designsystemetRedirects = (pathname: string) => {
  const redirectUrl = redirects.find(
    (r) =>
      r.from === pathname.toLowerCase() ||
      r.from + '/' === pathname.toLowerCase(),
  );
  if (redirectUrl) {
    return redirect(redirectUrl.to, {
      status: 301,
    });
  }
  return null;
};

const redirects = [
  {
    from: '/komponenter',
    to: '/no/components',
  },
  {
    from: '/bloggen',
    to: '/no/blog',
  },
  {
    from: '/god-praksis',
    to: '/no/best-practices',
  },
  {
    from: '/monstre',
    to: '/no/patterns',
  },
  {
    from: '/grunnleggende',
    to: '/no/fundamentals',
  },
];
