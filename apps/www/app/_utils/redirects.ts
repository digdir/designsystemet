export type Redirect = {
  from: string;
  to: string;
  /**
   * ISO date (YYYY-MM-DD). The redirect stops working from this date (UTC),
   * after which `from` is handled like any other unknown URL (404).
   */
  expires: string;
};

/** Query param added to the redirect target, so the page can tell the visitor to update their link */
export const REDIRECT_PARAM = 'redirected-from';

/**
 * Finds the active (not expired) redirect for a pathname.
 * Chains (a -> b -> c) are followed, so `to` is always the final destination
 * and `expires` is the earliest date in the chain.
 */
export const findRedirect = (
  pathname: string,
  now = new Date(),
): Redirect | null => {
  const from = pathname.toLowerCase().replace(/\/$/, '');
  let to = from;
  let expires = '';

  /* A chain can never be longer than the list, so this also guards against loops */
  for (let i = 0; i < redirects.length; i++) {
    const path = to.split('#')[0];
    const next = redirects.find(
      (r) => r.from === path && now < new Date(r.expires),
    );
    if (!next) break;
    to = next.to;
    expires = expires && expires < next.expires ? expires : next.expires;
  }

  return expires ? { from, to, expires } : null;
};

const redirects: Redirect[] = [
  {
    from: '/komponenter',
    to: '/no/components',
    expires: '2027-05-26',
  },
  {
    from: '/bloggen',
    to: '/no/blog',
    expires: '2027-05-26',
  },
  {
    from: '/god-praksis',
    to: '/no/best-practices',
    expires: '2027-05-26',
  },
  {
    from: '/monstre',
    to: '/no/patterns',
    expires: '2027-05-26',
  },
  {
    from: '/grunnleggende',
    to: '/no/fundamentals',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/introduction/values',
    to: '/no/intro/collaboration#values',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-tokens/variables',
    to: '/no/fundamentals/design-elements/variables',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/design-tokens/variables',
    to: '/en/fundamentals/design-elements/variables',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-tokens/colors',
    to: '/no/fundamentals/design-elements/colors',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/design-tokens/colors',
    to: '/en/fundamentals/design-elements/colors',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-tokens/sizes-and-spacing',
    to: '/no/fundamentals/theme/sizes-and-spacing',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/design-tokens/sizes-and-spacing',
    to: '/en/fundamentals/theme/sizes-and-spacing',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-elements/sizes-and-spacing',
    to: '/no/fundamentals/theme/sizes-and-spacing',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/design-elements/sizes-and-spacing',
    to: '/en/fundamentals/theme/sizes-and-spacing',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-tokens/typography',
    to: '/no/fundamentals/design-elements/typography',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/design-tokens/typography',
    to: '/en/fundamentals/design-elements/typography',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-tokens/shadows',
    to: '/no/fundamentals/design-elements/shadows',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/design-tokens/shadows',
    to: '/en/fundamentals/design-elements/shadows',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/resources/icons',
    to: '/no/fundamentals/design-elements/icons',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/resources/icons',
    to: '/en/fundamentals/design-elements/icons',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/themebuilder/own-theme',
    to: '/en/fundamentals/start-here/own-theme',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/themebuilder/own-theme',
    to: '/no/fundamentals/start-here/own-theme',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/introduction/get-started',
    to: '/en/fundamentals',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/introduction/get-started',
    to: '/no/fundamentals',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/introduction/about-the-design-system',
    to: '/en/intro/about-the-design-system',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/introduction/about-the-design-system',
    to: '/no/intro/about-the-design-system',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/introduction/collaboration',
    to: '/en/intro/collaboration',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/introduction/collaboration',
    to: '/no/intro/collaboration',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/introduction/accessibility',
    to: '/en/components/accessibility',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/introduction/accessibility',
    to: '/no/components/accessibility',
    expires: '2027-05-26',
  },
  {
    from: '/en/intro/accessibility',
    to: '/en/components/accessibility',
    expires: '2027-05-26',
  },
  {
    from: '/no/intro/accessibility',
    to: '/no/components/accessibility',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/design-elements/colors',
    to: '/en/fundamentals/theme/colors',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-elements/colors',
    to: '/no/fundamentals/theme/colors',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/design-elements/sizes-and-spacing',
    to: '/en/fundamentals/theme/sizes-and-spacing',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-elements/sizes-and-spacing',
    to: '/no/fundamentals/theme/sizes-and-spacing',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/design-elements/typography',
    to: '/en/fundamentals/theme/typography',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-elements/typography',
    to: '/no/fundamentals/theme/typography',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/design-elements/shadows',
    to: '/en/fundamentals/theme/shadows',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-elements/shadows',
    to: '/no/fundamentals/theme/shadows',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/design-elements/icons',
    to: '/en/fundamentals/theme/icons',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/design-elements/icons',
    to: '/no/fundamentals/theme/icons',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/figma/get-started',
    to: '/en/fundamentals/start-here/preparations#figma',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/figma/get-started',
    to: '/no/fundamentals/start-here/preparations#figma',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/figma/new-component',
    to: '/en/fundamentals/figma/variables-in-figma',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/figma/new-component',
    to: '/no/fundamentals/figma/variables-in-figma',
    expires: '2027-05-26',
  },

  {
    from: '/en/fundamentals/figma/get-started',
    to: '/en/fundamentals/start-here/preparations#figma',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/figma/get-started',
    to: '/no/fundamentals/start-here/preparations#figma',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/code/react',
    to: '/no/fundamentals/code/setup',
    expires: '2027-05-26',
  },
  {
    from: '/no/fundamentals/code/other-frameworks',
    to: '/no/fundamentals/code/setup',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/code/react',
    to: '/en/fundamentals/code/setup',
    expires: '2027-05-26',
  },
  {
    from: '/en/fundamentals/code/other-frameworks',
    to: '/en/fundamentals/code/setup',
    expires: '2027-05-26',
  },
];
