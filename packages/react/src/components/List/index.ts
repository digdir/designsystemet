import { ListHeading } from './ListHeading';
import { ListItem } from './ListItem';
import { ListRoot } from './ListRoot';
import { Ordered, Unordered } from './Lists';

type ListComponent = {
  Root: typeof ListRoot;
  Item: typeof ListItem;
  Heading: typeof ListHeading;
  Ordered: typeof Ordered;
  Unordered: typeof Unordered;
};

const List: ListComponent = {} as ListComponent;

List.Root = ListRoot;
List.Item = ListItem;
List.Heading = ListHeading;
List.Ordered = Ordered;
List.Unordered = Unordered;

List.Root.displayName = 'List.Root';
List.Item.displayName = 'List.Item';
List.Heading.displayName = 'List.Heading';
List.Ordered.displayName = 'List.Ordered';
List.Unordered.displayName = 'List.Unordered';

export type { ListProps } from './ListRoot';
export type { ListItemProps } from './ListItem';
export type { ListHeadingProps } from './ListHeading';
export type { ListOrderedProps, ListUnorderedProps } from './Lists';

export {
  List,
  ListRoot,
  ListItem,
  ListHeading,
  Ordered as ListOrdered,
  Unordered as ListUnordered,
};
