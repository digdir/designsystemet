import './style.css';
import '../../../packages/css/index.css';
import '@digdir/designsystemet-theme/digdir.css';

import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';

import type { LinkProps } from '@digdir/designsystemet-react';
import { Link, List, Paragraph, Table } from '@digdir/designsystemet-react';

import customTheme from './customTheme';

const viewports: Record<string, object> = {};
const viewportWidths = [320, 375, 576, 768, 992, 1200, 1440];

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
  p: (props: Props) => (
    <Paragraph {...props} className='sb-unstyled' data-ds-color-mode='light' />
  ),
  ol: (props: Props) => (
    <List.Ordered
      {...props}
      style={{ maxWidth: '70ch' }}
      className='sb-unstyled'
      data-ds-color-mode='light'
    />
  ),
  ul: (props: Props) => (
    <List.Unordered
      {...props}
      style={{ maxWidth: '70ch' }}
      className='sb-unstyled'
      data-ds-color-mode='light'
    />
  ),
  li: (props: Props) => (
    <List.Item
      {...props}
      className='sb-unstyled'
      style={{ maxWidth: '70ch' }}
      data-ds-color-mode='light'
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
        data-ds-color-mode='light'
      />
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
    parentSelector: '.sbdocs, .sb-main-padded',
  }),
];

export default preview;
