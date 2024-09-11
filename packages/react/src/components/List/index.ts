import { ListItem } from './ListItem';
import { ListOrdered, ListUnordered } from './Lists';

const List = {
  Item: ListItem,
  Ordered: ListOrdered,
  Unordered: ListUnordered,
};

List.Item.displayName = 'List.Item';
List.Ordered.displayName = 'List.Ordered';
List.Unordered.displayName = 'List.Unordered';

export type { ListOrderedProps, ListUnorderedProps } from './Lists';
export type { ListItemProps } from './ListItem';
export { List, ListOrdered, ListUnordered, ListItem };
