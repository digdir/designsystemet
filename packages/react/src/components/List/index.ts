import { List as ListRoot } from './List';
import { ListItem } from './ListItem';
import { ListHeading } from './ListHeading';
import { Ordered, Unordered } from './Lists';

export type { ListProps } from './List';
export type { ListItemProps } from './ListItem';

type ListComponent = typeof ListRoot & {
  Item: typeof ListItem;
  Heading: typeof ListHeading;
  Ordered: typeof Ordered;
  Unordered: typeof Unordered;
};

const List = ListRoot as ListComponent;

List.Item = ListItem;
List.Heading = ListHeading;
List.Ordered = Ordered;
List.Unordered = Unordered;

ListItem.displayName = 'List.Item';
ListHeading.displayName = 'List.Heading';
Ordered.displayName = 'List.Ordered';
Unordered.displayName = 'List.Unordered';

export {
  List,
  ListItem,
  ListHeading,
  Ordered as ListOrdered,
  Unordered as ListUnordered,
};
