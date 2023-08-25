import React from 'react';
import type { Preview } from '@storybook/react';
import cssVariablesTheme from '@etchteam/storybook-addon-css-variables-theme';

import altinn from '!!style-loader?injectType=lazyStyleTag!css-loader!@digdir/design-system-tokens/brand/altinn/tokens.css';
import digdir from '!!style-loader?injectType=lazyStyleTag!css-loader!@digdir/design-system-tokens/brand/digdir/tokens.css';
import tilsynet from '!!style-loader?injectType=lazyStyleTag!css-loader!@digdir/design-system-tokens/brand/tilsynet/tokens.css';
import brreg from '!!style-loader?injectType=lazyStyleTag!css-loader!@digdir/design-system-tokens/brand/brreg/tokens.css';

import '@altinn/figma-design-tokens/dist/tokens.css';
import {
  Paragraph,
  Link,
  Heading,
  HeadingProps,
} from '@digdir/design-system-react';
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

type Props = Record<string, unknown>;

const getHeading = (headingProps: HeadingProps) => (props: Props) =>
  (
    <Heading
      {...headingProps}
      {...props}
    ></Heading>
  );

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
      components: {
        p: (props: Props) => (
          <Paragraph
            style={{ maxWidth: '70ch' }}
            {...props}
          ></Paragraph>
        ),
        a: Link,
        h1: getHeading({ level: 1, size: 'xlarge' }),
        h2: getHeading({ level: 2, size: 'large' }),
        h3: getHeading({ level: 3, size: 'medium' }),
        h4: getHeading({ level: 4, size: 'small' }),
        h5: getHeading({ level: 5, size: 'xsmall' }),
        ul: (props: Props) => (
          <ul
            style={{ maxWidth: '70ch' }}
            {...props}
          ></ul>
        ),
        li: (props: Props) => (
          <Paragraph
            as='li'
            size='small'
            style={{ maxWidth: '70ch' }}
            {...props}
          ></Paragraph>
        ),
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Oversikt', 'Endringslogger', 'Felles', 'Altinn', 'Avviklet'],
      },
    },
    viewport: {
      viewports,
    },
  },
};

export default preview;
