import type no from './no';

export default {
  frontpage: {
    heading: 'Designsystemet helps you create good digital services',
    'for-designers': {
      title: 'For designers',
      description:
        'Learn how to get started with Designsystemet as a designer.',
    },
    'for-developers': {
      title: 'For developers',
      description:
        'Learn how to get started with Designsystemet as a developer.',
    },
    components: {
      title: 'Components',
      description: 'See the overview of UI components created in React.',
    },
    toolbox: {
      title: 'A common digital toolbox',
      description:
        'Designsystemet is a shared toolbox of foundational UI components, guidelines, and patterns to support the development of digital services. It helps teams build efficiently while ensuring consistent and user-friendly experiences.',
      link: 'Read more about Designsystemet',
    },
    'components-section': {
      title: 'Accessible and flexible components',
      description:
        'By creating the most basic components once, we ensure high quality. Each component is thoroughly tested and meets accessibility requirements. Components are built in both Figma and React, and can be combined in various ways to support different patterns.',
      fallbackImgAlt:
        'Design sketch of a mobile phone containing components from Designsystemet.',
    },
    'theme-section': {
      title: 'Use your own themes',
      description:
        'With theming, Designsystemet makes it possible to support different visual identities. This means everyone can build on the same foundation while tailoring the design to their own brand.',
      fallbackImgAlt:
        'Design sketch of a website showing how Designsystemet can be adapted to different identities.',
    },
    'latest-news': {
      title: 'Latest news from Designsystemet',
    },
    'join-section': {
      title: 'Join us in developing Designsystemet!',
      description:
        'By collaborating on Designsystemet, we can create more recognizable behavior in components and interaction patterns across the public sector. Designsystemet is meant to be a shared home for reusable components, best practices, user dialogue, insights, and more. Want to learn more or get involved? Get in touch!',
      buttons: {
        slack: 'Join us on Slack',
        github: 'Contribute on GitHub',
        email: 'Send an email',
      },
    },
    meta: {
      title: 'A common digital toolbox',
      description:
        'Designsystemet is a shared toolbox of core UI components, guidelines, and patterns for developing digital services. It supports efficient product development and helps create consistent and recognizable user experiences.',
    },
  },
  blog: {
    tag: 'Blog',
    title: 'Blog',
    description:
      'The blog features articles about Designsystemet, design, and development. It’s a space for sharing knowledge and experiences across teams.',
    write: {
      title: 'Want to write for the blog?',
      description:
        'Do you have something you want to share with others in the community? Contact us on ',
      slack: 'Slack',
      or: 'or by',
      email: 'email',
    },
  },
  sidebar: {
    Components: 'Components',
    Blogg: 'Blog',
    Tokens: 'Tokens',
    categories: {
      'Getting Started': 'Getting Started',
      'Design Principles': 'Design Principles',
      'For Designers': 'For Designers',
      'For Developers': 'For Developers',
      About: 'About',
    },
    items: {
      Introduction: 'Introduction',
      Installation: 'Installation',
      Typography: 'Typography',
      Colors: 'Colors',
      Layout: 'Layout',
      Accessibility: 'Accessibility',
      Contribution: 'Contribution',
    },
  },
  navigation: {
    fundamentals: 'Fundamentals',
    'best-practices': 'Best Practices',
    patterns: 'Patterns',
    blog: 'Blog',
    components: 'Components',
    'theme-builder': 'Theme Builder',
  },
  footer: {
    about: 'About Designsystemet',
    privacy: 'Privacy policy',
    accessibility: 'Accessibility statement',
    slack: 'Join us on Slack',
    agencies: {
      title: 'Created across public agencies:',
      contact: 'Your agency? Contact us!',
    },
    'about-site': 'About this site',
    'contact-us': 'Get in touch with us',
    copyright: 'Designsystemet',
  },
  accessibility: {
    'skip-link': 'Skip to main content',
  },
  errors: {
    default: {
      title: 'Oops!',
      details: 'An unexpected error occurred.',
    },
    '404': {
      title: '404',
      details:
        'The page you are looking for does not exist. Please check the URL or go back to the homepage.',
    },
    generic: {
      title: 'Error',
      'go-to-homepage': 'Go to homepage',
    },
  },
  header: {
    'home-link': 'Designsystemet home page',
    menu: 'Menu',
    'github-title': 'Designsystemet GitHub repository',
    'figma-title': 'Designsystemet Figma project',
    'theme-toggle': 'Switch to {{theme}} mode',
    'theme-toggle-aria': 'Switch to {{theme}} mode',
    light: 'light',
    dark: 'dark',
    'language-toggle': 'Switch language',
  },
  components: {
    title: 'Components',
    description:
      'Designsystemet contains basic components that can be combined in many different ways and in various patterns.',
  },
  patterns: {
    meta: {
      title: 'Patterns',
      description: 'Design patterns for reusable interface solutions',
    },
    title: 'Patterns',
    description:
      'Patterns are guidelines and recommendations for solving interactions and recurring user tasks. When the same patterns are used across services, they help create recognition and familiarity in the user experience.',
  },
  fundamentals: {
    title: 'Fundamentals',
    description:
      'Learn more about Designsystemet, the basic design elements, and how to get started as a designer or developer.',
  },
  'best-practices': {
    title: 'Best practices',
    description:
      'Here we share best practices with each other. Advice and guidance that can help create better services are gathered here.',
    back: 'Back',
  },
  mdx: {
    error: {
      loading: 'Could not load content',
    },
  },
} satisfies typeof no;
