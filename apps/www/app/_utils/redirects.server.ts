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
    from: '/en/fundamentals/design-tokens/variables',
    to: '/en/fundamentals/designelementer/variables',
  },
  {
    from: '/no/fundamentals/design-tokens/colors',
    to: '/no/fundamentals/designelementer/colors',
  },
  {
    from: '/en/fundamentals/design-tokens/colors',
    to: '/en/fundamentals/designelementer/colors',
  },
  {
    from: '/no/fundamentals/design-tokens/sizes-and-spacing',
    to: '/no/fundamentals/designelementer/sizes-and-spacing',
  },
  {
    from: '/en/fundamentals/design-tokens/sizes-and-spacing',
    to: '/en/fundamentals/designelementer/sizes-and-spacing',
  },
  {
    from: '/no/fundamentals/design-tokens/typography',
    to: '/no/fundamentals/designelementer/typography',
  },
  {
    from: '/en/fundamentals/design-tokens/typography',
    to: '/en/fundamentals/designelementer/typography',
  },
  {
    from: '/no/fundamentals/design-tokens/shadows',
    to: '/no/fundamentals/designelementer/shadows',
  },
  {
    from: '/en/fundamentals/design-tokens/shadows',
    to: '/en/fundamentals/designelementer/shadows',
  },
  {
    from: '/no/fundamentals/resources/icons/',
    to: '/no/fundamentals/designelementer/icons',
  },
  {
    from: '/en/fundamentals/resources/icons/',
    to: '/en/fundamentals/designelementer/icons',
  },
];
