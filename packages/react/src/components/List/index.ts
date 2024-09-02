import { List as ListParent } from './List';
import { ListItem } from './ListItem';

type ListComponent = typeof ListParent & {
  Item: typeof ListItem;
};

const List = ListParent as ListComponent;

List.Item = ListItem;
List.Item.displayName = 'List.Item';

export type { ListProps } from './List';
export type { ListItemProps } from './ListItem';

export { List, ListItem };
