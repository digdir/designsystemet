import type no from '../no/theme-modal';

export default {
  'use-theme': 'Use theme',
  'theme-name': 'Give your theme a name',
  'theme-name-description':
    'The name should represent the organisation or product you are profiling.',
  'generate-css': 'Generate CSS',
  'generating-css': 'Generating CSS...',
  in: 'in',
  'core-ui-kit': 'Core UI Kit (opens in new tab)',
  'to-update':
    'to update a theme directly in Figma. Read more about these options on',
  'own-theme': 'your own theme (opens in new tab)',
  page: 'page.',
  format: 'Format for Windows',
  'help-heading': 'Something not working?',
  'help-description': 'Send us a message on',
  slack: 'Slack (opens in new tab)',
  or: 'or create a',
  'github-issue': 'Github issue (opens in new tab)',
  color: 'Colour',
  config: {
    heading: 'Config file',
    description:
      'Use this when you want to get started with Figma and generate design tokens, a CSS file or other kinds of code.',
    download: 'Download {{filename}}',
    'step-one':
      'Download config file to where you want the tokens and CSS to be generated.',
    'step-two':
      'Open a terminal in the same folder as the config file. Run the code snippets to generate tokens and CSS variables for code.',
    help: 'Read more about how to synchronize tokens with Figma here:',
  },
  css: {
    heading: 'CSS file',
    description:
      'Use this when you want to prototype in code and get started quickly.',
    'step-one': 'Download and import it after "@digdir/designsystemet-css".',
    download: 'Download {{filename}}',
    error: 'Could not generate CSS for the theme.',
  },
  'severity-colors': 'Severity',
  'severity-colors-switch': 'Activate to override severity colors',
} as typeof no;
