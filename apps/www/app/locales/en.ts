import type no from './no';

export default {
  frontpage: {
    heading: 'Designsystemet helps you create good digital services',
    'for-designers': {
      title: 'For designers',
      description:
        'Learn how to get started with the design system as a designer.',
    },
    'for-developers': {
      title: 'For developers',
      description:
        'Learn how to get started with the design system as a developer.',
    },
    components: {
      title: 'Components',
      description: 'See the overview of UI components created in React.',
    },
    toolbox: {
      title: 'A common digital toolbox',
      description:
        'The design system is a common toolbox with basic UI components, guidelines, and patterns that you can use when developing digital services. The design system contributes to efficient product development and holistic user experiences.',
      link: 'Read more about the design system',
    },
    'components-section': {
      title: 'Accessible and flexible components',
      description:
        'When we create the most basic components just once, we ensure good quality. The component is well tested, and we maintain accessibility requirements. The components are created in Figma and React. You can combine them in many different ways and in various patterns.',
      fallbackImgAlt:
        'Design sketch of a mobile phone containing components from the design system.',
    },
    'theme-section': {
      title: 'Use your own themes',
      description:
        'The design system supports different identities through themes. This way, everyone can use the same design system as a basis but adapt to different sender identities.',
      fallbackImgAlt:
        'Design sketch of a website showing how the design system can be adapted to different identities.',
    },
    'latest-news': {
      title: 'Latest news from the design system',
    },
    'join-section': {
      title: 'Join us in developing the design system!',
      description:
        'By collaborating on the design system, we can create more holistic user experiences across the public sector. At the same time, we save ourselves from doing the same tasks multiple times. The design system should be a common home for reusable components, best practices, interaction patterns, user dialogue, insights, and more. Want to hear more or help? Contact us!',
      buttons: {
        slack: 'Join us on Slack',
        github: 'Contribute on GitHub',
        email: 'Send an email',
      },
    },
    meta: {
      title: 'A common digital toolbox',
      description:
        'The design system is a common toolbox with basic UI components, guidelines, and patterns that you can use when developing digital services. The design system contributes to efficient product development and holistic user experiences.',
    },
  },
  blog: {
    tag: 'Blog',
    title: 'Blog',
    description:
      'The blog contains articles about the design system, design, and development. The blog is a place for sharing knowledge and experiences with each other.',
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
    show: 'Show',
    hide: 'Hide',
    sidebar: 'sidebar',
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
    about: 'About the design system',
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
    'home-link': 'Design system home page',
    menu: 'Menu',
    'github-title': 'Design system GitHub repository',
    'figma-title': 'Design system Figma project',
    'theme-toggle': 'Switch to {{theme}} mode',
    'theme-toggle-aria': 'Switch to {{theme}} mode',
    light: 'light',
    dark: 'dark',
    'language-toggle': 'Switch language',
  },
  components: {
    title: 'Components',
    description:
      'The design system contains basic components that can be combined in many different ways and in various patterns.',
  },
  patterns: {
    meta: {
      title: 'Patterns',
      description: 'Design patterns for reusable interface solutions',
    },
    title: 'Patterns',
    description:
      'Patterns are guidelines and recommendations for how to solve interaction and recurring user tasks. When the same patterns are used across services, we create recognition and familiarity in the user experience.',
  },
  fundamentals: {
    title: 'Fundamentals',
    description:
      'Learn more about the design system, the basic design elements, and how to get started as a designer or developer.',
  },
  'best-practices': {
    title: 'Best practices',
    description:
      'Here we share best practices with each other. Advice and guidance that can help create better holistic services are gathered here.',
    back: 'Back',
  },
  mdx: {
    error: {
      loading: 'Could not load content',
    },
  },
  video: {
    'watch-video': 'Watch video',
  },
} satisfies typeof no;
