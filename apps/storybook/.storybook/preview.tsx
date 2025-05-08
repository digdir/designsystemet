import './style.css';
import './customTheme.scss';
import '../../../packages/css/src/index.css';
import '../../../packages/theme/src/designsystemet/build/designsystemet.css';
import { LinkIcon } from '@navikt/aksel-icons';
import type { Preview } from '@storybook/react';
import isChromatic from 'chromatic/isChromatic';
import componentStyles from './componentOverrides.module.scss';

import type { HeadingProps, LinkProps } from '@digdir/designsystemet-react';
import {
  Heading,
  Link,
  List,
  Paragraph,
  Table,
} from '@digdir/designsystemet-react';

import { Children, type MouseEventHandler } from 'react';
import { CodeBlock } from '../../_components';
import { customStylesDecorator } from '../story-utils/customStylesDecorator';
import { fontsLoader } from '../story-utils/fontsLoader';
import { allModes, viewportWidths } from '../story-utils/modes';
import { transformSource } from '../story-utils/transformSource';
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

const handleLinkClick =
  (href: string): MouseEventHandler<HTMLAnchorElement> =>
  (event) => {
    // Handle in-page anchor links
    if (href.startsWith('#')) {
      event.preventDefault();
      document
        .getElementById(href.substring(1))
        ?.scrollIntoView({ behavior: 'smooth' });
      window.parent.history.pushState(undefined, '', href);
    }
  };

const HeadingSelfLink: React.FC<HeadingProps> = ({ children, ...props }) => {
  const href = `#${props.id}`;
  return (
    <Heading {...props} className={`sb-unstyled ${componentStyles.heading}`}>
      {children}
      <Link
        aria-hidden
        tabIndex={-1}
        href={href}
        className={componentStyles.headingLink}
        onClick={handleLinkClick(href)}
      >
        <LinkIcon title='Link to this heading' />
      </Link>
    </Heading>
  );
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
  h1: (props: Props) => <HeadingSelfLink data-size='lg' {...props} level={1} />,
  h2: (props: Props) => <HeadingSelfLink data-size='md' {...props} level={2} />,
  h3: (props: Props) => <HeadingSelfLink data-size='sm' {...props} level={3} />,
  h4: (props: Props) => <HeadingSelfLink data-size='sm' {...props} level={4} />,
  h5: (props: Props) => <HeadingSelfLink data-size='sm' {...props} level={5} />,
  h6: (props: Props) => <HeadingSelfLink data-size='sm' {...props} level={6} />,
  p: (props: Props) => (
    <Paragraph
      {...props}
      className={`sb-unstyled ${componentStyles.paragraph}`}
      data-color-scheme='light'
    />
  ),
  ol: (props: Props) => (
    <List.Ordered
      {...props}
      className={`sb-unstyled ${componentStyles.list}`}
      data-color-scheme='light'
    />
  ),
  ul: (props: Props) => (
    <List.Unordered
      {...props}
      className={`sb-unstyled ${componentStyles.list}`}
      data-color-scheme='light'
    />
  ),
  li: (props: Props) => (
    <List.Item
      {...props}
      className={`sb-unstyled ${componentStyles.listItem}`}
      data-color-scheme='light'
    />
  ),
  a: ({ children, ...props }: LinkProps) => {
    // if link starts with /, add current path to link
    const href = getPath(props.href);

    return (
      <Link
        {...props}
        href={href}
        className={`sb-unstyled ${componentStyles.link}`}
        onClick={handleLinkClick(props.href ?? '')}
        // Add a data-attribute for use when styling links which include code snippets
        {...(Children.count(children) === 1 && { 'data-single-child': true })}
      >
        {children}
      </Link>
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
  globalTypes: {
    codePreview: {
      description: '"Show code" will output the selected format',
      toolbar: {
        icon: 'markup',
        items: [
          { title: 'HTML', value: 'html' },
          { title: 'React', value: 'react' },
        ],
        dynamicTitle: true,
      },
    },
    colorScheme: {
      description: 'Set color-scheme in stories',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    codePreview: 'react',
    colorScheme: 'light',
  },
  parameters: {
    layout: 'centered',
    viewMode: 'docs',
    docs: {
      theme: customTheme,
      components,
      source: {
        transform: transformSource,
        type: 'auto',
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
    a11y: {
      test: 'error',
    },
    backgrounds: {
      disable: true,
    },
    html: {
      root: '.storybook-decorator', // default: #root
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
