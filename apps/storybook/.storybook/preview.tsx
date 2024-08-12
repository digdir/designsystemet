import '@digdir/designsystemet-css/index.css';
import '@digdir/designsystemet-theme/digdir.css';

import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';

import type { LinkProps } from '@digdir/designsystemet-react';
import { Link, List, Paragraph, Table } from '@digdir/designsystemet-react';

import customTheme from './customTheme';

const viewports = [320, 375, 576, 768, 992, 1200, 1440].map((width) => ({
  name: `${width}px`,
  styles: {
    width: `${width}px`,
    height: '100%',
  },
}));

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
  p: (props: Props) => (
    <Paragraph
      {...props}
      className='sb-unstyled'
      spacing
      data-ds-color-mode='light'
    />
  ),
  ol: (props: Props) => (
    <List.Root>
      <List.Ordered
        {...props}
        style={{ maxWidth: '70ch' }}
        className='sb-unstyled'
        data-ds-color-mode='light'
      />
    </List.Root>
  ),
  ul: (props: Props) => (
    <List.Root>
      <List.Unordered
        {...props}
        style={{ maxWidth: '70ch' }}
        className='sb-unstyled'
        data-ds-color-mode='light'
      />
    </List.Root>
  ),
  li: (props: Props) => (
    <List.Item
      {...props}
      className='sb-unstyled'
      style={{ maxWidth: '70ch' }}
      data-ds-color-mode='light'
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
        data-ds-color-mode='light'
      ></Link>
    );
  },
  table: (props: Props) => (
    <Table
      {...props}
      zebra
      className='sb-unstyled'
      style={{ width: '100%' }}
      data-ds-color-mode='light'
    />
  ),
  thead: (props: Props) => (
    <Table.Head {...props} className='sb-unstyled' data-ds-color-mode='light' />
  ),
  tbody: (props: Props) => (
    <Table.Body {...props} className='sb-unstyled' data-ds-color-mode='light' />
  ),
  tr: (props: Props) => (
    <Table.Row {...props} className='sb-unstyled' data-ds-color-mode='light' />
  ),
  th: (props: Props) => (
    <Table.HeaderCell
      {...props}
      className='sb-unstyled'
      data-ds-color-mode='light'
    />
  ),
  td: (props: Props) => (
    <Table.Cell {...props} className='sb-unstyled' data-ds-color-mode='light' />
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
    backgrounds: {
      disable: true,
    },
  },
};

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      Light: 'light',
      Dark: 'dark',
      Auto: 'auto',
    },
    defaultTheme: 'Light',
    attributeName: 'data-ds-color-mode',
  }),
];

export default preview;
