import {
  Alert,
  Badge,
  Card,
  CardBlock,
  Details,
  DetailsContent,
  DetailsSummary,
  Divider,
  Heading,
  type HeadingProps,
  Link,
  type LinkProps,
  ListOrdered,
  type ListOrderedProps,
  ListUnordered,
  type ListUnorderedProps,
  Paragraph,
  type ParagraphProps,
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  type TableProps,
  TableRow,
  Tabs,
} from '@digdir/designsystemet-react';
import {
  BorderRadiusVariablesTable,
  CodeBlock,
  ColorTokensTable,
  OpacityVariablesTable,
  ShadowVariablesTable,
  SizeVariablesTable,
  TypographyVariablesTable,
} from '@internal/components';
import { getMDXComponent } from 'mdx-bundler/dist/client';
import { type ComponentType, type JSX, type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RRLink, useLoaderData } from 'react-router';
import { ColorInfoTable } from '~/_components/color-info-table/color-info-table';
import { Contributors } from '~/_components/contributors/contributors';
import { Image } from '~/_components/image/image';
import { ResponsiveIframe } from '~/_components/responsive-iframe/responsive-iframe';
import { getStoryHtml, type RenderedStory } from '~/_utils/story-html';
import { CssVariables } from '../css-variables/css-variables';
import { DoDont } from '../do-dont/do-dont';
import {
  LiveComponent,
  type LiveComponentProps,
} from '../live-component/live-components';
import { RoiCalculator } from '../roi-calculator/roi-calcuator';
import { VideoCard } from '../video-card/video-card';
import classes from './mdx-components.module.css';

/**
 * Links to files, like /llms.txt or a page's .md version, are not app routes.
 * The server answers them, so they need a full page load.
 */
const isFileLink = (href: string) =>
  /\.[a-z0-9]+$/i.test(href.split(/[?#]/)[0].split('/').pop() ?? '');

const MdxLink = ({ href = '', ...props }: LinkProps) => (
  <Link {...props} asChild>
    <RRLink to={href} reloadDocument={isFileLink(href)}>
      {props.children}
    </RRLink>
  </Link>
);

const defaultComponents = {
  VideoCard,
  Alert,
  Badge,
  Details,
  DetailsContent,
  DetailsSummary,
  Card,
  CardBlock,
  Divider,
  Tabs,
  Table: (props: TableProps) => (
    <div className={classes.tableWrapper}>
      <Table {...props} />
    </div>
  ),
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableFoot,
  TableCell,
  h1: (props: HeadingProps) => (
    <Heading className={classes.heading} level={1} data-size='xl' {...props} />
  ),
  h2: (props: HeadingProps) => (
    <Heading className={classes.heading} level={2} data-size='md' {...props} />
  ),
  h3: (props: HeadingProps) => (
    <Heading className={classes.heading} level={3} data-size='sm' {...props} />
  ),
  h4: (props: HeadingProps) => (
    <Heading className={classes.heading} level={4} data-size='xs' {...props} />
  ),
  h5: (props: HeadingProps) => (
    <Heading className={classes.heading} level={5} data-size='xs' {...props} />
  ),
  h6: (props: HeadingProps) => (
    <Heading className={classes.heading} level={6} data-size='xs' {...props} />
  ),
  ol: (props: ListOrderedProps) => <ListOrdered {...props} />,
  ul: (props: ListUnorderedProps) => <ListUnordered {...props} />,
  hr: (props: JSX.IntrinsicElements['hr']) => <Divider {...props} />,
  Image,
  ResponsiveIframe,
  Contributors,
  ColorInfoTable,
  p: (props: ParagraphProps) => <Paragraph {...props} />,
  Link: MdxLink,
  a: MdxLink,
  pre: ({
    children: {
      props: { children = '', className = '' },
    },
  }) => {
    return (
      <div data-documentation-code-block>
        <pre hidden>
          <code className={className}>{children}</code>
        </pre>
        {/* Already formatted when the MDX was compiled, see prettifyCodeBlocks */}
        <CodeBlock
          language={className.replace('language-', '')}
          prettify={false}
        >
          {children}
        </CodeBlock>
      </div>
    );
  },
  table: (props: TableProps) => (
    <div className={classes.tableWrapper}>
      <Table data-color='neutral' border zebra {...props} />
    </div>
  ),
  CssVariables,
  RoiCalculator,
  BorderRadiusVariablesTable,
  ColorTokensTable,
  OpacityVariablesTable,
  ShadowVariablesTable,
  SizeVariablesTable,
  TypographyVariablesTable,
};

export const MDXComponents = ({
  components,
  code,
}: {
  components?: Record<string, ComponentType<unknown>>;
  code?: string;
}) => {
  const { t } = useTranslation();

  const Component = useMemo(() => {
    if (!code) return null;
    return getMDXComponent(code);
  }, [code]);

  return (
    <>
      {Component ? (
        <Component
          components={{
            ...defaultComponents,
            Story: Story,
            DoDont: DoDontComponent,
            ...components,
          }}
        />
      ) : (
        t('mdx.error.loading')
      )}
    </>
  );
};

const Story = ({
  story,
  language = 'html',
  ...rest
}: Omit<LiveComponentProps, 'html' | 'name'>) => {
  const { stories } = useLoaderData() as {
    stories?: RenderedStory[] | null;
  };
  if (!stories) return null;

  const foundStory = stories.find((s) => s.name === story);
  if (!foundStory) return <Alert lang='en'>Story not found: {story}</Alert>;
  return (
    <LiveComponent
      story={foundStory.code}
      name={foundStory.name}
      html={getStoryHtml(foundStory)}
      language={language}
      {...rest}
    />
  );
};

const DoDontComponent = ({
  story,
  children,
  layout,
}: {
  story: string;
  layout?: 'row' | 'column' | 'centered';
  children?: ReactNode;
}) => {
  const { dodont } = useLoaderData() as {
    dodont?: RenderedStory[] | null;
  };
  if (!dodont) return <Alert lang='en'>Do/Dont not found: {story}</Alert>;

  const foundStory = dodont.find((s) => s.name === story);
  if (!foundStory) return <Alert lang='en'>Do/Dont not found: {story}</Alert>;
  const variant = story.toLowerCase().includes('dont') ? 'dont' : 'do';
  return (
    <DoDont
      layout={layout}
      variant={variant}
      code={`${foundStory.code}\n\nrender(<${foundStory.name} />)`}
      html={getStoryHtml(foundStory)}
    >
      {children}
    </DoDont>
  );
};
