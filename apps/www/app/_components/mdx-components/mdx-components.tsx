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
import { type JSX, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RRLink } from 'react-router';
import { CodeBlock } from '~/_components/code-block/code-block';
import { Contributors } from '~/_components/contributors/contributors';
import { Image } from '~/_components/image/image';
import { ResponsiveIframe } from '~/_components/responsive-iframe/responsive-iframe';
import classes from './mdx-components.module.css';

const defaultComponents = {
  Details,
  DetailsContent,
  DetailsSummary,
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableFoot,
  TableCell,
  h1: (props: JSX.IntrinsicElements['h1']) => (
    <Heading className={classes.heading} level={1} {...props} />
  ),
  h2: (props: JSX.IntrinsicElements['h2']) => (
    <Heading className={classes.heading} level={2} {...props} />
  ),
  h3: (props: JSX.IntrinsicElements['h3']) => (
    <Heading className={classes.heading} level={3} {...props} />
  ),
  h4: (props: JSX.IntrinsicElements['h4']) => (
    <Heading className={classes.heading} level={4} {...props} />
  ),
  h5: (props: JSX.IntrinsicElements['h5']) => (
    <Heading className={classes.heading} level={5} {...props} />
  ),
  h6: (props: JSX.IntrinsicElements['h6']) => (
    <Heading className={classes.heading} level={6} {...props} />
  ),
  ol: (props: JSX.IntrinsicElements['ol']) => <ListOrdered {...props} />,
  ul: (props: JSX.IntrinsicElements['ul']) => <ListUnordered {...props} />,
  Image,
  ResponsiveIframe,
  Contributors,
  /* TokenList, */
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
    <Table data-color='neutral' border zebra {...props} />
  ),
};

export const MDXComponents = ({
  components,
  code,
}: {
  components?: {
    [key: string]: JSX.Element;
  };
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
