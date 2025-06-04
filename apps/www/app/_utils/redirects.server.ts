import { redirect } from 'react-router';

export const designsystemetRedirects = (pathname: string) => {
  console.log({ pathname });

  const redirectUrl = redirects.find((r) => r.from === pathname);
  if (redirectUrl) {
    return redirect(redirectUrl.to);
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
    from: '/bloggen/2024/altinn-studio',
    to: '/no/blog/2024/altinn-studio',
  },
  {
    from: '/bloggen/2024/bachelor-temavelger',
    to: '/no/blog/2024/bachelor-themeselector',
  },
  {
    from: '/bloggen/2024/fluid-typography',
    to: '/no/blog/2024/fluid-typography',
  },
  {
    from: '/monstre',
    to: '/no/patterns',
  },
  {
    from: '/monstre/representasjon',
    to: '/no/patterns/representation',
  },
  {
    from: '/monstre/obligatoriske-og-valgfrie-felt',
    to: '/no/patterns/required-and-optional-fields',
  },
  {
    from: '/monstre/systemvarsler',
    to: '/no/patterns/systemnotifications',
  },
  {
    from: '/monstre/feilmeldinger',
    to: '/no/patterns/errors',
  },
  {
    from: '/grunnleggende',
    to: '/no/fundamentals',
  },
  {
    from: '/grunnleggende/om-designsystemet',
    to: '/no/fundamentals/introduction/about-the-design-system',
  },
];
