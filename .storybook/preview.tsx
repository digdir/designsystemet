import type { Preview } from '@storybook/react';
import '@altinn/figma-design-tokens/dist/tokens.css';
import '@digdir/design-system-tokens/dist/digdir/tokens.css';
import './inter.css';
import customTheme from './customTheme';
import metadata from '../design-tokens/$metadata.json';

type Viewport = {
  name: string;
  styles: {
    width: string;
    height: string;
  };
};

const viewports: Viewport[] = metadata.tokenSetOrder
  .filter((name) => name.toLowerCase().includes('viewport'))
  .map((name) => {
    const width = name.replace(/\D/g, '');

    return {
      name: `@${width}`,
      styles: {
        width: `${width}px`,
        height: '100%',
      },
    };
  });

const preview: Preview = {
  parameters: {
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
    viewport: {
      viewports,
    },
  },
};

export default preview;
