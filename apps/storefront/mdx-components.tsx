import type {
  HeadingProps,
  LinkProps,
  ListItemProps,
  ListOrderedProps,
  ListUnorderedProps,
  ParagraphProps,
  TableBodyProps,
  TableCellProps,
  TableHeadProps,
  TableHeaderCellProps,
  TableProps,
  TableRowProps,
} from '@digdir/designsystemet-react';
import {
  Heading,
  Link,
  ListItem,
  ListOrdered,
  ListUnordered,
  Paragraph,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
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
    p: (props) => <Paragraph {...(props as ParagraphProps)} />,
    a: (props) => <Link {...(props as LinkProps)} />,
    ol: (props) => <ListOrdered {...(props as ListOrderedProps)} />,
    ul: (props) => <ListUnordered {...(props as ListUnorderedProps)} />,
    li: (props) => <ListItem {...(props as ListItemProps)}></ListItem>,
    h1: (props) => (
      <Heading
        {...(props as HeadingProps)}
        level={1}
        data-size='xl'
        style={{
          marginBottom: 'var(--ds-size-4)',
        }}
      />
    ),
    h2: (props) => (
      <Heading {...(props as HeadingProps)} level={2} data-size='md' />
    ),
    h3: (props) => (
      <Heading {...(props as HeadingProps)} level={3} data-size='sm' />
    ),
    h4: (props) => (
      <Heading {...(props as HeadingProps)} level={4} data-size='xs' />
    ),
    h5: (props) => (
      <Heading {...(props as HeadingProps)} level={5} data-size='xs' />
    ),
    h6: (props) => (
      <Heading {...(props as HeadingProps)} level={6} data-size='xs' />
    ),
    table: (props) => (
      <Table {...(props as TableProps)} border zebra data-color='neutral' />
    ),
    thead: (props) => <TableHead {...(props as TableHeadProps)} />,
    tbody: (props) => <TableBody {...(props as TableBodyProps)} />,
    tr: (props) => <TableRow {...(props as TableRowProps)} />,
    th: (props) => <TableHeaderCell {...(props as TableHeaderCellProps)} />,
    td: (props) => <TableCell {...(props as TableCellProps)} />,
  };
}
