import { List as ListRoot } from './List';
import { ListItem } from './ListItem';
import { ListHeading } from './ListHeading';

export type { ListProps } from './List';
export type { ListItemProps } from './ListItem';

type ListComponent = typeof ListRoot & {
  Item: typeof ListItem;
  Heading: typeof ListHeading;
};

const List = ListRoot as ListComponent;

List.Item = ListItem;
List.Heading = ListHeading;

ListItem.displayName = 'List.Item';
ListHeading.displayName = 'List.Heading';

export { List, ListItem };
