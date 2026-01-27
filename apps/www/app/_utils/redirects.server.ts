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
    to: '/no/intro/collaboration#values',
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
    to: '/no/fundamentals/theme/sizes-and-spacing',
  },
  {
    from: '/en/fundamentals/design-tokens/sizes-and-spacing',
    to: '/en/fundamentals/theme/sizes-and-spacing',
  },
  {
    from: '/no/fundamentals/design-elements/sizes-and-spacing',
    to: '/no/fundamentals/theme/sizes-and-spacing',
  },
  {
    from: '/en/fundamentals/design-elements/sizes-and-spacing',
    to: '/en/fundamentals/theme/sizes-and-spacing',
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
    from: '/no/fundamentals/resources/icons',
    to: '/no/fundamentals/design-elements/icons',
  },
  {
    from: '/en/fundamentals/resources/icons',
    to: '/en/fundamentals/design-elements/icons',
  },
  {
    from: '/en/fundamentals/themebuilder/own-theme',
    to: '/en/fundamentals/start-here/own-theme',
  },
  {
    from: '/no/fundamentals/themebuilder/own-theme',
    to: '/no/fundamentals/start-here/own-theme',
  },

  {
    from: '/en/fundamentals/introduction/get-started',
    to: '/en/fundamentals',
  },
  {
    from: '/no/fundamentals/introduction/get-started',
    to: '/no/fundamentals',
  },

  {
    from: '/en/fundamentals/introduction/about-the-design-system',
    to: '/en/intro/about-the-design-system',
  },
  {
    from: '/no/fundamentals/introduction/about-the-design-system',
    to: '/no/intro/about-the-design-system',
  },

  {
    from: '/en/fundamentals/introduction/collaboration',
    to: '/en/intro/collaboration',
  },
  {
    from: '/no/fundamentals/introduction/collaboration',
    to: '/no/intro/collaboration',
  },

  {
    from: '/en/fundamentals/introduction/accessibility',
    to: '/en/intro/accessibility',
  },
  {
    from: '/no/fundamentals/introduction/accessibility',
    to: '/no/intro/accessibility',
  },

  {
    from: '/en/fundamentals/design-elements/colors',
    to: '/en/fundamentals/theme/colors',
  },
  {
    from: '/no/fundamentals/design-elements/colors',
    to: '/no/fundamentals/theme/colors',
  },

  {
    from: '/en/fundamentals/design-elements/sizes-and-spacing',
    to: '/en/fundamentals/theme/sizes-and-spacing',
  },
  {
    from: '/no/fundamentals/design-elements/sizes-and-spacing',
    to: '/no/fundamentals/theme/sizes-and-spacing',
  },

  {
    from: '/en/fundamentals/design-elements/typography',
    to: '/en/fundamentals/theme/typography',
  },
  {
    from: '/no/fundamentals/design-elements/typography',
    to: '/no/fundamentals/theme/typography',
  },

  {
    from: '/en/fundamentals/design-elements/shadows',
    to: '/en/fundamentals/theme/shadows',
  },
  {
    from: '/no/fundamentals/design-elements/shadows',
    to: '/no/fundamentals/theme/shadows',
  },

  {
    from: '/en/fundamentals/design-elements/icons',
    to: '/en/fundamentals/theme/icons',
  },
  {
    from: '/no/fundamentals/design-elements/icons',
    to: '/no/fundamentals/theme/icons',
  },

  {
    from: '/en/fundamentals/figma/get-started',
    to: '/en/fundamentals/start-here/preparations#figma',
  },
  {
    from: '/no/fundamentals/figma/get-started',
    to: '/no/fundamentals/start-here/preparations#figma',
  },

  {
    from: '/en/fundamentals/figma/get-started',
    to: '/en/fundamentals/start-here/preparations#figma',
  },
  {
    from: '/no/fundamentals/figma/get-started',
    to: '/no/fundamentals/start-here/preparations#figma',
  },
];
