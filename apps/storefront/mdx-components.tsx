import type {
  ListItemProps,
  ListOrderedProps,
  ListUnorderedProps,
  ParagraphProps,
  LinkProps,
  HeadingProps,
} from '@digdir/designsystemet-react';
import {
  Link,
  ListItem,
  ListOrdered,
  ListRoot,
  ListUnordered,
  Paragraph,
  Heading,
} from '@digdir/designsystemet-react';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: (props: ParagraphProps) => {
      return <Paragraph {...props} />;
    },
    a: (props) => {
      return <Link {...(props as LinkProps)} />;
    },
    ol: (props: ListOrderedProps) => (
      <ListRoot>
        <ListOrdered {...props} />
      </ListRoot>
    ),
    ul: (props: ListUnorderedProps) => (
      <ListRoot>
        <ListUnordered {...props} />
      </ListRoot>
    ),
    li: (props: ListItemProps) => <ListItem {...props}></ListItem>,
    h1: (props: HeadingProps) => (
      <Heading
        {...props}
        level={1}
        size='xl'
        spacing
      />
    ),
    h2: (props: HeadingProps) => (
      <Heading
        {...props}
        level={2}
        size='md'
      />
    ),
    h3: (props: HeadingProps) => (
      <Heading
        {...props}
        level={3}
        size='sm'
      />
    ),
    h4: (props: HeadingProps) => (
      <Heading
        {...props}
        level={4}
        size='xs'
      />
    ),
    h5: (props: HeadingProps) => (
      <Heading
        {...props}
        level={5}
        size='xs'
      />
    ),
    h6: (props: HeadingProps) => (
      <Heading
        {...props}
        level={6}
        size='xs'
      />
    ),
  };
}
