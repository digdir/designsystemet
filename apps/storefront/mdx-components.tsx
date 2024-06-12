import type {
  ListItemProps,
  ListOrderedProps,
  ListUnorderedProps,
  ParagraphProps,
  LinkProps,
} from '@digdir/designsystemet-react';
import {
  Link,
  ListItem,
  ListOrdered,
  ListRoot,
  ListUnordered,
  Paragraph,
} from '@digdir/designsystemet-react';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    p: (props: ParagraphProps) => {
      return <Paragraph {...props} />;
    },
    a: (props: LinkProps) => {
      return <Link {...props} />;
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
  };
}
