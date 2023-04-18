import React from 'react';
import { DocsContainer } from '@storybook/blocks';
import '@altinn/figma-design-tokens/dist/tokens.css';
import './inter.css';
import './customStyling.css';
import customTheme from './customTheme';
import { TableOfContents } from '../docs-components';

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
      <>
        <DocsContainer {...rest}>
          <TableOfContents />
          {children}
        </DocsContainer>
      </>
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
      order: ['Komponentoversikt', 'Kjernekomponenter'],
    },
  },
};
