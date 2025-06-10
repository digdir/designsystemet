import type no from './no';

export default {
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
