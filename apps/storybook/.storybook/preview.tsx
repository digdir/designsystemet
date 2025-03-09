import './style.css';
import '../../../packages/css/src/index.css';
import '@digdir/designsystemet-theme/digdir.css';
import type { Preview } from '@storybook/react';
import isChromatic from 'chromatic/isChromatic';

import type { LinkProps } from '@digdir/designsystemet-react';
import { Link, List, Paragraph, Table } from '@digdir/designsystemet-react';

import { CodeBlock } from '../../_components';
import { customStylesDecorator } from '../story-utils/customStylesDecorator';
import { fontsLoader } from '../story-utils/fontsLoader';
import { allModes, viewportWidths } from '../story-utils/modes';
import customTheme from './customTheme';

const viewports: Record<string, object> = {};

for (const width of viewportWidths) {
  viewports[`${width}px`] = {
    name: `${width}px`,
    styles: {
      width: `${width}px`,
      height: '100%',
    },
  };
}

type Props = Record<string, unknown>;

const getPath = (href: string | undefined): string => {
  if (!href) {
    return '';
  }

  // if link starts with /, add current path to link
  if (href.startsWith('/')) {
    const { origin = '' } = document.location;

    return `${origin}/?path=${href}`;
  }

  return href;
};

const components = {
  pre: ({
    children: {
      props: { children = '', className = '' },
    },
  }) => {
    return (
      <CodeBlock
        className={'sb-unstyled'}
        language={className.replace('language-', '')}
      >
        {children}
      </CodeBlock>
    );
  },
  p: (props: Props) => (
    <Paragraph
      {...props}
      className='sb-unstyled'
      data-color-scheme='light'
      style={{
        backgroundColor: 'transparent',
      }}
    />
  ),
  ol: (props: Props) => (
    <List.Ordered
      {...props}
      style={{ maxWidth: '70ch' }}
      className='sb-unstyled'
      data-color-scheme='light'
    />
  ),
  ul: (props: Props) => (
    <List.Unordered
      {...props}
      style={{ maxWidth: '70ch' }}
      className='sb-unstyled'
      data-color-scheme='light'
    />
  ),
  li: (props: Props) => (
    <List.Item
      {...props}
      className='sb-unstyled'
      style={{ maxWidth: '70ch' }}
      data-color-scheme='light'
    />
  ),
  a: (props: LinkProps) => {
    // if link starts with /, add current path to link
    const href = getPath(props.href);

    return (
      <Link
        {...props}
        href={href}
        className='sb-unstyled'
        data-color-scheme='light'
      />
    );
  },
  table: (props: Props) => (
    <Table
      {...props}
      zebra
      className='sb-unstyled'
      style={{ width: '100%' }}
      data-color-scheme='light'
      data-color='neutral'
    />
  ),
  thead: (props: Props) => (
    <Table.Head {...props} className='sb-unstyled' data-color-scheme='light' />
  ),
  tbody: (props: Props) => (
    <Table.Body {...props} className='sb-unstyled' data-color-scheme='light' />
  ),
  tr: (props: Props) => (
    <Table.Row {...props} className='sb-unstyled' data-color-scheme='light' />
  ),
  th: (props: Props) => (
    <Table.HeaderCell
      {...props}
      className='sb-unstyled'
      data-color-scheme='light'
    />
  ),
  td: (props: Props) => (
    <Table.Cell {...props} className='sb-unstyled' data-color-scheme='light' />
  ),
};

const preview: Preview = {
  tags: ['a11y-test'],
  parameters: {
    layout: 'centered',
    viewMode: 'docs',
    docs: {
      theme: customTheme,
      components,
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
        order: [
          'Oversikt',
          'Kom i gang',
          'Endringslogger',
          'Komponenter',
          'Utilities',
          'Experimental',
          'Primitives',
          'Avviklet',
        ],
      },
    },
    viewport: {
      viewports,
    },
    chromatic: {
      // Disable snapshots by default
      disableSnapshot: true,
      modes: {
        mobile: allModes[320],
        desktop: allModes[1200],
      },
    },
    backgrounds: {
      disable: true,
    },
  },
  decorators: [customStylesDecorator],
  loaders: isChromatic() && document.fonts ? [fontsLoader] : [],
};

/* Add this back when https://github.com/storybookjs/storybook/issues/29189 is fixed */
/* export const decorators = [
  withThemeByDataAttribute({
    themes: {
      Light: 'light',
      Dark: 'dark',
      Auto: 'auto',
    },
    defaultTheme: 'Light',
    attributeName: 'data-color-scheme',
    parentSelector:
      '.sbdocs-preview .docs-story div:first-of-type, .sb-show-main:has(#storybook-docs[hidden="true"])',
  }),
]; */

export default preview;
