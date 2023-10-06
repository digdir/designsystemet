import { List as ListRoot } from './List';
import { ListItem } from './ListItem/ListItem';

export type { ListProps } from './List';
export type { ListItemProps } from './ListItem/ListItem';

type ListComponent = typeof ListRoot & {
  Item: typeof ListItem;
};

const List = ListRoot as ListComponent;

List.Item = ListItem;

List.Item.displayName = 'List.Item';

export { List, ListItem };
