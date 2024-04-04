import * as React from 'react';
import type { Preview } from '@storybook/react';

import '@digdir/designsystemet-theme/brand/digdir/tokens.css';
import '@digdir/designsystemet-css/index.css';

import {
  Paragraph,
  Link,
  LinkProps,
  List,
  Table,
} from '@digdir/designsystemet-react';
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

const getPath = (href: string | undefined): string => {
  if (!href) {
    return '';
  }

  // if link starts with /, add current path to link
  if (href.startsWith('/')) {
    const { origin = '' } = document?.location;

    return `${origin}/?path=${href}`;
  }

  return href;
};

const components = {
  p: (props: Props) => (
    <Paragraph
      {...props}
      className='sb-unstyled'
      spacing
    />
  ),
  ol: (props: Props) => (
    <List.Root>
      <List.Ordered
        {...props}
        style={{ maxWidth: '70ch' }}
        className='sb-unstyled'
      />
    </List.Root>
  ),
  ul: (props: Props) => (
    <List.Root>
      <List.Unordered
        {...props}
        style={{ maxWidth: '70ch' }}
        className='sb-unstyled'
      />
    </List.Root>
  ),
  li: (props: Props) => (
    <List.Item
      {...props}
      className='sb-unstyled'
      style={{ maxWidth: '70ch' }}
    ></List.Item>
  ),
  a: (props: LinkProps) => {
    // if link starts with /, add current path to link
    const href = getPath(props.href);

    return (
      <Link
        {...props}
        href={href}
        className='sb-unstyled'
      ></Link>
    );
  },
  table: (props: Props) => (
    <Table
      {...props}
      zebra
      className='sb-unstyled'
      style={{ width: '100%' }}
    />
  ),
  thead: (props: Props) => (
    <Table.Head
      {...props}
      className='sb-unstyled'
    />
  ),
  tbody: (props: Props) => (
    <Table.Body
      {...props}
      className='sb-unstyled'
    />
  ),
  tr: (props: Props) => (
    <Table.Row
      {...props}
      className='sb-unstyled'
    />
  ),
  th: (props: Props) => (
    <Table.HeaderCell
      {...props}
      className='sb-unstyled'
    />
  ),
  td: (props: Props) => (
    <Table.Cell
      {...props}
      className='sb-unstyled'
    />
  ),
};

const preview: Preview = {
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
          'Experimental',
          'Primitives',
          'Avviklet',
        ],
      },
    },
    viewport: {
      viewports,
    },
  },
};

export default preview;
