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
  'use-config-file':
    'Save your config file as "designsystemet.config.json". If you want to use the schema, install "@digdir/designsystemet"',
  config: {
    heading: 'Config file',
    description:
      'Keep the theme in a config file and generate tokens and CSS with the CLI, so the theme is easy to update.',
    download: 'Download {{filename}}',
    'step-one':
      'Save your config file as "designsystemet.config.json" where you want the tokens and CSS to be generated. Read more about how to synchronize tokens with Figma here:',
    'step-two':
      'Open a terminal in the same folder as the config file. Run the code snippets to generate tokens and CSS variables for code.',
  },
  css: {
    heading: 'CSS file',
    description:
      'Download the CSS for the theme directly. It is not updated with new versions of Designsystemet, so download it again to get updates.',
    'step-one': 'Download and import it after "@digdir/designsystemet-css"',
    download: 'Download {{filename}}',
    error: 'Could not generate CSS for the theme.',
  },
  'severity-colors': 'Severity',
  'severity-colors-switch': 'Activate to override severity colors',
} as typeof no;
