import { ListItem } from './list-item';
import { ListOrdered, ListUnordered } from './lists';

const List = {
  Item: ListItem,
  Ordered: ListOrdered,
  Unordered: ListUnordered,
};

List.Item.displayName = 'List.Item';
List.Ordered.displayName = 'List.Ordered';
List.Unordered.displayName = 'List.Unordered';

export type { ListItemProps } from './list-item';
export type { ListOrderedProps, ListUnorderedProps } from './lists';
export { List, ListOrdered, ListUnordered, ListItem };
