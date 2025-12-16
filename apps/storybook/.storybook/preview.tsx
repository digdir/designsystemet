import './style.css';
/* We use relative imports to get HMR updates when developing */
import '../../../packages/css/src/index.css';
import '../../../packages/theme/brand/digdir.css';

import {
  Heading,
  Link,
  List,
  Paragraph,
  Table,
} from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import isChromatic from 'chromatic/isChromatic';
import { Children } from 'react';
import { customStylesDecorator } from '../story-utils/customStylesDecorator';
import { fontsLoader } from '../story-utils/fontsLoader';
import { allModes, viewportWidths } from '../story-utils/modes';
import type { MdxComponentOverrides } from '../story-utils/type-extensions';
import customTheme from './customThemeLight';

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
  pre: (props) => {
    const {
      children: {
        props: { children = '', className = '' },
      },
    } = props as {
      children: { props: { children?: string; className?: string } };
    };
    return (
      <CodeBlock
        className={'sb-unstyled'}
        language={className.replace('language-', '')}
      >
        {children}
      </CodeBlock>
    );
  },
  h1: (props) => <Heading data-size='lg' {...props} level={1} />,
  h2: (props) => <Heading data-size='md' {...props} level={2} />,
  h3: (props) => <Heading data-size='sm' {...props} level={3} />,
  h4: (props) => <Heading data-size='xs' {...props} level={4} />,
  h5: (props) => <Heading data-size='xs' {...props} level={5} />,
  h6: (props) => <Heading data-size='xs' {...props} level={6} />,
  p: (props) => <Paragraph {...props} className={`sb-unstyled`} />,
  ol: (props) => <List.Ordered {...props} className={`sb-unstyled`} />,
  ul: (props) => <List.Unordered {...props} className={`sb-unstyled`} />,
  li: (props) => <List.Item {...props} className={`sb-unstyled`} />,
  a: ({ children = '', ...props }) => {
    // if link starts with /, add current path to link
    const href = getPath(props.href);

    return (
      <Link
        {...props}
        href={href}
        className={`sb-unstyled`}
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
      data-color='neutral'
    />
  ),
  thead: (props) => <Table.Head {...props} className='sb-unstyled' />,
  tbody: (props) => <Table.Body {...props} className='sb-unstyled' />,
  tr: (props) => <Table.Row {...props} className='sb-unstyled' />,
  th: (props) => <Table.HeaderCell {...props} className='sb-unstyled' />,
  td: (props) => <Table.Cell {...props} className='sb-unstyled' />,
} satisfies MdxComponentOverrides;

const DocsContainerWithWrapper: typeof DocsContainer = ({
  children,
  context,
  ...props
}) => {
  return (
    <div className='custom-docs-wrapper'>
      <DocsContainer context={context} {...props}>
        {children}
      </DocsContainer>
    </div>
  );
};

const preview: Preview = {
  tags: ['a11y-test'],
  globalTypes: {
    colorScheme: {
      description: 'Set color-scheme for stories only',
      toolbar: {
        title: 'Story Theme',
        icon: 'moon',
        items: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
          { title: 'Auto', value: 'auto' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorScheme: 'auto',
  },
  parameters: {
    layout: 'centered',
    viewMode: 'docs',
    docs: {
      theme: customTheme,
      components,
      //@ts-ignore
      container: DocsContainerWithWrapper,
      /* @ts-ignore this is a type error as of 9.0.6*/
      codePanel: true,
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
      root: '[data-storybook-decorator]', // default: #root
    },
  },
  decorators: [customStylesDecorator],
  loaders: isChromatic() && document.fonts ? [fontsLoader] : [],
};

export default preview;
