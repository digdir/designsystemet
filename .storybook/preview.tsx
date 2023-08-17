import type { Preview } from '@storybook/react';
import cssVariablesTheme from '@etchteam/storybook-addon-css-variables-theme';

import altinn from '!!style-loader?injectType=lazyStyleTag!css-loader!@digdir/design-system-tokens/brand/altinn/tokens.css';
import digdir from '!!style-loader?injectType=lazyStyleTag!css-loader!@digdir/design-system-tokens/brand/digdir/tokens.css';
import tilsynet from '!!style-loader?injectType=lazyStyleTag!css-loader!@digdir/design-system-tokens/brand/tilsynet/tokens.css';
import brreg from '!!style-loader?injectType=lazyStyleTag!css-loader!@digdir/design-system-tokens/brand/brreg/tokens.css';

import '@altinn/figma-design-tokens/dist/tokens.css';
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
  decorators: [cssVariablesTheme],
  parameters: {
    cssVariables: {
      files: {
        Altinn: altinn,
        Digdir: digdir,
        Tilsynet: tilsynet,
        Brønnøysundregistrene: brreg,
      },
      defaultTheme: 'Digdir',
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
