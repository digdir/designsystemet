import type {
  HeadingProps,
  LinkProps,
  ListItemProps,
  ListOrderedProps,
  ListUnorderedProps,
  ParagraphProps,
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
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: (props: ParagraphProps) => <Paragraph {...props} spacing />,
    a: (props) => <Link {...(props as LinkProps)} />,
    ol: (props: ListOrderedProps) => <ListOrdered {...props} />,
    ul: (props: ListUnorderedProps) => <ListUnordered {...props} />,
    li: (props: ListItemProps) => <ListItem {...props}></ListItem>,
    h1: (props: HeadingProps) => (
      <Heading {...props} level={1} size='xl' spacing />
    ),
    h2: (props: HeadingProps) => <Heading {...props} level={2} size='md' />,
    h3: (props: HeadingProps) => <Heading {...props} level={3} size='sm' />,
    h4: (props: HeadingProps) => <Heading {...props} level={4} size='xs' />,
    h5: (props: HeadingProps) => <Heading {...props} level={5} size='xs' />,
    h6: (props: HeadingProps) => <Heading {...props} level={6} size='xs' />,
    table: (props) => <Table {...props} border zebra />,
    thead: (props) => <TableHead {...props} />,
    tbody: (props) => <TableBody {...props} />,
    tr: (props) => <TableRow {...props} />,
    th: (props) => <TableHeaderCell {...props} />,
    td: (props) => <TableCell {...props} />,
  };
}
