import customTheme from './customTheme.js';
import './inter.css';
import './customStyling.css';

export const parameters = {
  layout: 'centered',
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme: customTheme,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: [
        'Introduksjon',
        'Design Tokens',
        'Core components',
        ['Introduksjon', 'Button'],
        'Changelog',
        ['Design Tokens', 'Core components', 'Web components'],
      ],
    },
  },
};
