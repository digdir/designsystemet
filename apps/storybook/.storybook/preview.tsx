import './style.css';
import './customTheme.scss';
/* We use relative imports to get HMR updates when developing */
import '../../../packages/css/src/index.css';
import '../../../packages/theme/brand/digdir.css';

import type { HeadingProps } from '@digdir/designsystemet-react';
import {
  Heading,
  Link,
  List,
  Paragraph,
  Table,
} from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { LinkIcon } from '@navikt/aksel-icons';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import isChromatic from 'chromatic/isChromatic';
import { Children, type MouseEventHandler } from 'react';
import { addons } from 'storybook/preview-api';
import { customStylesDecorator } from '../story-utils/customStylesDecorator';
import { fontsLoader } from '../story-utils/fontsLoader';
import { allModes, viewportWidths } from '../story-utils/modes';
import { transformSource } from '../story-utils/transformSource';
import type { MdxComponentOverrides } from '../story-utils/type-extensions';
import componentStyles from './componentOverrides.module.scss';
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
  h1: (props) => <HeadingSelfLink data-size='lg' {...props} level={1} />,
  h2: (props) => <HeadingSelfLink data-size='md' {...props} level={2} />,
  h3: (props) => <HeadingSelfLink data-size='sm' {...props} level={3} />,
  h4: (props) => <HeadingSelfLink data-size='xs' {...props} level={4} />,
  h5: (props) => <HeadingSelfLink data-size='xs' {...props} level={5} />,
  h6: (props) => <HeadingSelfLink data-size='xs' {...props} level={6} />,
  p: (props) => (
    <Paragraph
      {...props}
      className={`sb-unstyled ${componentStyles.paragraph}`}
    />
  ),
  ol: (props) => (
    <List.Ordered
      {...props}
      className={`sb-unstyled ${componentStyles.list}`}
    />
  ),
  ul: (props) => (
    <List.Unordered
      {...props}
      className={`sb-unstyled ${componentStyles.list}`}
    />
  ),
  li: (props) => (
    <List.Item
      {...props}
      className={`sb-unstyled ${componentStyles.listItem}`}
    />
  ),
  a: ({ children = '', ...props }) => {
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
    // Hidden global for manager-preview communication
    managerColorScheme: {
      description: 'Color scheme from manager (internal communication)',
      defaultValue: 'auto',
    },
    // Visible global for story-specific theme switching
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
    codePreview: 'react',
    managerColorScheme: 'auto',
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

      source: {
        transform: transformSource,
        type: 'auto',
      },
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

const channel = addons.getChannel();

channel.on('globalsUpdated', (data) => {
  if (data.globals?.managerColorScheme) {
    const newScheme = data.globals.managerColorScheme;
    document.body.setAttribute('data-color-scheme', newScheme);
  }
});

export default preview;
