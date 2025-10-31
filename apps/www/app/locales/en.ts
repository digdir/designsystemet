import en from '@internal/components/src/_locales/en';
import type no from './no';

export default {
  ...en,
  frontpage: {
    heading: 'Designsystemet helps you build better digital services',
    'get-started': {
      title: 'Get started',
      description: 'Learn how to get started with Designsystemet',
    },
    patterns: {
      title: 'Patterns',
      description:
        'Understand how shared patterns contribute to consistent user experiences',
    },
    components: {
      title: 'Components',
      description:
        'See the overview of UI components created in React, CSS and Figma.',
    },
    toolbox: {
      title: 'A common design system',
      description:
        'Designsystemet is a shared toolbox of foundational UI components, guidelines, and patterns to support the development of digital services. It helps teams build efficiently while ensuring consistent and user-friendly experiences.',
      link: 'Read more about Designsystemet',
    },
    'components-section': {
      title: 'Accessible and flexible components',
      description:
        'By creating the most basic components once in a common design system, we ensure high quality. Each component is thoroughly tested and meets accessibility requirements. Components are built in both Figma and React, and can be combined in various ways to support different patterns.',
      link: 'Read more about accessibility',
      fallbackImgAlt:
        'Design sketch of a mobile phone containing components from Designsystemet.',
    },
    'theme-section': {
      title: 'Use your own themes',
      description:
        'With theming, Designsystemet makes it possible to support different visual identities. This means everyone can build on the same foundation while tailoring the design to their own brand.',
      link: 'Build your theme',
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
      Figma: 'Figma',
      Code: 'Kode',
      About: 'About',
      components: 'Components',
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
  accessibility: {
    'skip-link': 'Skip to main content',
  },
  errors: {
    default: {
      title: 'Oops!',
      details: 'An unexpected error occurred.',
    },
    '404': {
      title: '404 - Page Not Found',
      details: 'It might have been removed or moved.',
    },
    generic: {
      title: 'Error',
      'go-to-homepage': 'Go to homepage',
    },
  },
  components: {
    title: 'Components',
    description:
      'Designsystemet contains basic components that can be combined in many different ways and in various patterns.',
  },
  component: {
    overview: 'Overview',
    code: 'Code',
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
    'breadcrumbs-label': 'You are here:',
  },
  mdx: {
    error: {
      loading: 'Could not load content',
    },
  },
  video: {
    'watch-video': 'Watch video on {{url}}',
  },
  image: {
    'enlarged-text': 'Click the image or press Escape to close',
    'aria-label': {
      enlarged: 'Click to minimize image.',
      normal: 'Click to enlarge image.',
    },
  },
  'image-banner': {
    'play-video': 'Play video',
    'pause-video': 'Pause video',
  },
  'live-component': {
    activateA: 'Press',
    activateB: 'Enter',
    activateC: 'to start editing',
    'show-code': 'Show code',
    'hide-code': 'Hide code',
    'invert-color-scheme': 'invert color scheme',
    copy: 'Copy',
    reset: 'Reset',
  },
  'token-preview': {
    size: {
      description:
        'The value of size variables is set by the `data-size` attribute.',
      'select-label': 'Select size (data-size)',
    },
    color: {
      description:
        'The value of color variables is set by the `data-color` attribute.',
      'select-label': 'Select color (data-color)',
    },
    'search-in-design-tokens': 'Search in design tokens',
    'search-input-aria-label':
      'Search for variable names in CSS for design tokens',
    colors: 'Colors',
    typography: 'Typography',
    semantic: 'Semantic tokens',
    'no-results': 'No results found',
    table: {
      variable: 'Variable',
      value: 'Value',
      name: 'Name',
      preview: 'Preview',
      light: 'Light',
      dark: 'Dark',
    },
  },
  toc: {
    title: 'Contents',
  },
  do: 'Do',
  dont: "Don't",
  contributors: 'Contributors',
  editOnGithub: 'Edit this page on github.com (opens in a new tab)',
} satisfies typeof no;
