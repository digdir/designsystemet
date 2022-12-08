import customTheme from './customTheme.js';
import './inter.css';
import './customStyling.css';
import React from 'react';
import { DocsContainer } from '@storybook/addon-docs';
import '@altinn/figma-design-tokens/dist/tokens.css';
import { TableOfContents } from '../../docs-components';

export const parameters = {
  status: {
    statuses: {
      new: {
        background: '#0000ff',
        color: '#ffffff',
        description: 'This component is stable and released',
      },
      beta: {
        background: '#6544c5',
        color: '#ffffff',
        description: 'This component is stable and released',
      },
    },
  },
  layout: 'centered',
  viewMode: 'docs',
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme: customTheme,
    container: ({ children, ...rest }) => (
      <React.Fragment>
        <DocsContainer {...rest}>
          <TableOfContents />
          {children}
        </DocsContainer>
      </React.Fragment>
    ),
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
