import type no from './no';

export default {
  footer: {
    about: 'About Designsystemet',
    privacy: 'Privacy policy',
    accessibility: 'Accessibility statement',
    slack: 'Join us on Slack',
    description:
      'Designsystemet is a shared toolbox of basic UI components, guidelines, and patterns that you can use when developing digital solutions. It is open and free for everyone.',
    'about-site': 'About this site',
    'contact-us': 'Get in touch with us',
    copyright: 'Designsystemet',
  },
  header: {
    'home-link': 'Designsystemet home page',
    'open-menu': 'Open menu',
    'close-menu': 'Close menu',
    'theme-toggle': 'Switch to {{theme}} mode',
    'theme-toggle-aria': 'Switch to {{theme}} mode',
    light: 'light',
    dark: 'dark',
    'language-toggle': 'Switch language',
    'back-to-home': 'Go back to the home page',
  },
  'clipboard-button': {
    copy: 'Copy',
    copied: 'Copied',
  },
  'color-modal': {
    hexcode: 'Hexcode',
    'css-variable': 'CSS variable',
    'relative-luminance': 'Relative luminance',
    'can-be-used-against': 'Can be used against',
    'color-combinations': {
      'all-colors': 'All colors',
      'background-subtle-and-default': 'Background subtle and Default',
      'background-colors-and-surface-default':
        'Background colors and Surface Default',
      'background-colors-and-surface-colors':
        'Background colors and Surface colors',
      'base-colors': 'Base colors',
    },
  },
} satisfies typeof no;
