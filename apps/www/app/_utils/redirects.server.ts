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
  {
    from: '/no/fundamentals/introduction/values',
    to: '/no/fundamentals/introduction/about-the-design-system#verdier',
  },
  {
    from: '/no/fundamentals/design-tokens/variables',
    to: '/no/fundamentals/design-elements/variables',
  },
  {
    from: '/en/fundamentals/design-tokens/variables',
    to: '/en/fundamentals/design-elements/variables',
  },
  {
    from: '/no/fundamentals/design-tokens/colors',
    to: '/no/fundamentals/design-elements/colors',
  },
  {
    from: '/en/fundamentals/design-tokens/colors',
    to: '/en/fundamentals/design-elements/colors',
  },
  {
    from: '/no/fundamentals/design-tokens/sizes-and-spacing',
    to: '/no/fundamentals/design-elements/sizes-and-spacing',
  },
  {
    from: '/en/fundamentals/design-tokens/sizes-and-spacing',
    to: '/en/fundamentals/design-elements/sizes-and-spacing',
  },
  {
    from: '/no/fundamentals/design-tokens/typography',
    to: '/no/fundamentals/design-elements/typography',
  },
  {
    from: '/en/fundamentals/design-tokens/typography',
    to: '/en/fundamentals/design-elements/typography',
  },
  {
    from: '/no/fundamentals/design-tokens/shadows',
    to: '/no/fundamentals/design-elements/shadows',
  },
  {
    from: '/en/fundamentals/design-tokens/shadows',
    to: '/en/fundamentals/design-elements/shadows',
  },
  {
    from: '/no/fundamentals/resources/icons/',
    to: '/no/fundamentals/design-elements/icons',
  },
  {
    from: '/en/fundamentals/resources/icons/',
    to: '/en/fundamentals/design-elements/icons',
  },
];
