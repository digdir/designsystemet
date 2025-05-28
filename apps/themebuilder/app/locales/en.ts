import type no from './no';

export default {
  hello: 'Hello',
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
  accessibility: {
    'skip-link': 'Skip to main content',
  },
} satisfies typeof no;
