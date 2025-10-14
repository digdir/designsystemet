import {
  Card,
  Details,
  DetailsContent,
  DetailsSummary,
  Heading,
  Link,
  ListOrdered,
  ListUnordered,
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
} from '@digdir/designsystemet-react';
import { getMDXComponent } from 'mdx-bundler/dist/client';
import { type ComponentType, type JSX, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RRLink } from 'react-router';
import { CodeBlock } from '../code-block/code-block';
import classes from './mdx-components.module.css';

const defaultComponents = {
  Details,
  DetailsContent,
  DetailsSummary,
  Card,
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
  h1: (props: JSX.IntrinsicElements['h1']) => (
    <Heading level={1} data-size='xl' {...props} />
  ),
  h2: (props: JSX.IntrinsicElements['h2']) => (
    <Heading level={2} data-size='md' {...props} />
  ),
  h3: (props: JSX.IntrinsicElements['h3']) => (
    <Heading level={3} data-size='sm' {...props} />
  ),
  h4: (props: JSX.IntrinsicElements['h4']) => (
    <Heading level={4} data-size='xs' {...props} />
  ),
  h5: (props: JSX.IntrinsicElements['h5']) => (
    <Heading level={5} data-size='xs' {...props} />
  ),
  h6: (props: JSX.IntrinsicElements['h6']) => (
    <Heading level={6} data-size='xs' {...props} />
  ),
  ol: (props: JSX.IntrinsicElements['ol']) => <ListOrdered {...props} />,
  ul: (props: JSX.IntrinsicElements['ul']) => <ListUnordered {...props} />,
  p: (props: ParagraphProps) => <Paragraph {...props} />,
  Link: ({ href, ...props }: JSX.IntrinsicElements['a']) => (
    <Link {...props} asChild>
      <RRLink to={href || ''}>{props.children}</RRLink>
    </Link>
  ),
  a: ({ href, ...props }: JSX.IntrinsicElements['a']) => (
    <Link {...props} asChild>
      <RRLink to={href || ''}>{props.children}</RRLink>
    </Link>
  ),
  pre: ({
    children: {
      props: { children = '', className = '' },
    },
  }) => {
    return (
      <CodeBlock language={className.replace('language-', '')}>
        {children}
      </CodeBlock>
    );
  },
  table: (props: TableProps) => (
    <div className={classes.tableWrapper}>
      <Table data-color='neutral' border zebra {...props} />
    </div>
  ),
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
            ...components,
          }}
        />
      ) : (
        t('mdx.error.loading')
      )}
    </>
  );
};
