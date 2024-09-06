import { ListOrdered, ListUnordered } from './List';
import { ListItem } from './ListItem';

const List = {
  Item: ListItem,
  Ordered: ListOrdered,
  Unordered: ListUnordered
};

List.Item.displayName = 'List.Item';
List.Ordered.displayName = 'List.Ordered';
List.Unordered.displayName = 'List.Unordered';

export type { ListOrderedProps, ListUnorderedProps } from './List';
export type { ListItemProps } from './ListItem';
export { List, ListItem };
